<template>
  <a-modal
      title="信息详情"
      centered
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="50%"
      cancelText="取消"
      okText="确认"
      @ok="handleCancel"
      @cancel="handleCancel"
      :afterClose="clearMod"
  >
    <div class="detail-mod">
      <a-row :gutter="24" v-if="details.title"><a-col :span="4">标题</a-col><a-col class="noBorder" :span="14" style="font-size: 24px;font-weight: bolder">{{details.title}}</a-col></a-row>
      <a-row :gutter="24" v-if="details.emergType"><a-col :span="4">紧急类型</a-col>
        <a-col :span="14" class="noBorder">
          <a-tag :color="details.emergType == 1? 'red': 'blue'" style="font-size: 18px;padding: 5px 15px">
            {{ details.emergType == 1?'紧急':details.emergType == 2?'常规':''}}
          </a-tag>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="details.disasterType"><a-col :span="4">灾种类型</a-col><a-col :span="14">{{ getRiskName(details.disasterType)}}</a-col></a-row>
      <a-row :gutter="24" v-if="details.warningLevel"><a-col :span="4">预警级别</a-col>
        <a-col :span="14" class="noBorder">
          <a-tag :color="details.warningLevel == 1? 'red': details.warningLevel == 2?'orange':details.warningLevel == 3?'yellow':'blue'" style="font-size: 18px;padding: 5px 15px">
            {{ getLevelName(details.warningLevel)}}
          </a-tag>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="details.publishingUnit"><a-col :span="4">发布单位</a-col><a-col :span="14">{{details.publishingUnit}}</a-col></a-row>
      <a-row :gutter="24" v-if="details.content"><a-col :span="4">信息内容</a-col><a-col :span="14">{{details.content}}</a-col></a-row>
      <a-row :gutter="24" v-if="details.directViewUrl"><a-col :span="4">直览附件</a-col><a-col :span="14" style="border: none"><a :href="details.directViewUrl" target="_blank" class="urlClick">{{details.directViewUrl}}</a></a-col></a-row>
      <a-row :gutter="24" v-if="details.recipients && details.recipients.length>0">
        <a-col :span="4">接收人</a-col>
        <a-col :span="20">
        <b>本次共发送信息给 {{details.recipients.length}}人：</b><br/><br/>
        {{details.recipients.map(i=>i.realName + '(' + i.phone + ')').join(',')}}
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="details.acceptingUnitIds && details.acceptingUnitIds.length>0">
        <a-col :span="4">接收人</a-col>
        <a-col :span="20">
          <b>本次共发送信息给 {{details.acceptingUnitIds.length}}人：</b><br/><br/>
          {{details.acceptingUnitIds.map(i=>i.recipienterName + '(' + i.recipienterPhone + ')').join(',')}}
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="details.attachments && details.attachments.length > 0"><a-col :span="4">附件内容</a-col>
        <a-col :span="14" class="noBorder">
          <a-button @click="viewFile(item)" type="link" v-for="(item,index) in details.attachments" :key="index"><a-icon type="paper-clip"/>{{item.attachementName}}</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="showMeasure == true"><a-col :span="4">基础措施</a-col>
        <a-col :span="14" class="noBorder">
          <div v-for="(item,index) in measureDetail.baseMeasures" :key="index">
            {{index+1}}、{{item}}
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="showMeasure == true"><a-col :span="4">响应反馈</a-col><a-col :span="14">{{measureDetail.responseMeasure}}</a-col></a-row>
    </div>
  </a-modal>
</template>

<script>
import {getReviewDetailByWorker} from "@/api/review";
import axios from "axios";
import Cookies from "js-cookie";
import {responseMeasure} from "@/api/new";
export default {
  name: 'msgDetailMod',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      details: {},
      measureDetail: {},
      showMeasure: false,
      riskOptions: [
        {name: '地震',value: 1},
        {name: '气象',value: 3},
        {name: '地质灾害',value: 4},
        {name: '水旱',value: 5},
        {name: '森林草原火灾',value: 6}
      ],
      levelOptions: [
        {name: '红色预警',value: 1},
        {name: '橙色预警',value: 2},
        {name: '黄色预警',value: 3},
        {name: '蓝色预警',value: 4}
      ]
    }
  },
  created() {
    const t = this
  },
  methods:{
    clearMod(){

    },

    async getDetails(id){
      const t = this
      const res = await getReviewDetailByWorker(id)
      if(res.data.code == 100){
        if(res.data.data){
          t.details = res.data.data
        }else{
          t.$message.error('查询信息详情失败')
        }
      }else{
        this.$message.error(res.data.msg)
      }
    },

    async getMeasures(id){
      const t = this
      const res = await responseMeasure({id:id})
      if(res.data.code == 100){
        const data = res.data.data
        if(data.baseMeasures && data.baseMeasures.length > 0){
          t.measureDetail = data
          t.showMeasure = true
        }else{
          t.measureDetail = {}
          t.showMeasure = false
        }
      }else{
        this.$message.error(res.data.msg)
      }
    },

    viewFile(item){
      const t = this
      const { baseUrl } = require('../../../../config/env.' + process.env.NODE_ENV)
      axios.get(baseUrl + item.attachement,{headers:{'Content-Type': 'application/json','tk': `${Cookies.get('resTk')}`,'uid':`${Cookies.get('resUid')}`},responseType: 'blob'}).then(res=>{
        if (res) {
          const link = document.createElement('a')
          let blob = new Blob([res.data],{type: res.data.type})
          link.style.display = "none";
          link.href = URL.createObjectURL(blob); // 创建URL
          window.open(link.href)
          // link.setAttribute("download", item.attachementName);
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
        } else {
          this.$message.error('获取文件失败')
        }
      })
    },

    handleOk(e) {
      const t = this
      t.confirmLoading = true;
    },
    handleCancel(e) {
      const t = this
      t.visible = false;
    },
    onChange(value) {
      console.log(value);
    },

    getRiskName(disasterType){
      return this.riskOptions.find(i => i.value === disasterType)?.name;
    },
    getLevelName(warningLevel){
      return this.levelOptions.find(i => i.value === warningLevel)?.name;
    }

  }
}
</script>

<style lang="less" scoped>
.detail-mod{
  font-size: 16px;

  .ant-row{
    margin-bottom: 24px;
    display: flex;
    align-items: center;

    &:first-of-type{
      margin-bottom: 12px;
    }

    .ant-col{
      &:first-of-type{
        text-align: right;
      }

      &:last-of-type{
        border: 1px solid #d9d9d9;
        padding: 5px 10px;
      }
    }

    .noBorder{
      border: none !important;
      padding: 5px 10px;
    }

    .table{
      display: flex;
      align-items: center;
      border-bottom: 1px solid @blackBorder;
      &:last-of-type{
        border-bottom: none;
      }
      &>div{
        padding: 5px 10px;
      }
    }
  }
}
.urlClick:hover{
  text-decoration: underline;
}
</style>
