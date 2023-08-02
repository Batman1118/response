<template>
  <a-modal
      title="叫应列表"
      centered
      :visible="visible"
      width="50%"
      cancelText="取消"
      @cancel="handleCancel"
      @ok="handleCancel"
  >
    <a-table :columns="columns" :data-source="data" bordered :pagination="pagination" :rowKey="record=>record.id">
      <template #index="text,record,index">
        {{ index + 1 }}
      </template>
      <template #receiveUnit="name,record">
        <span v-if="unitType == 3">{{ name }}</span>
        <span v-else style="cursor: pointer;color: #1890ff" @click="digData(record.forwardWarnInfoId,record.unittype)">{{ name }}</span>
      </template>
      <template #warningLevel="text">
        <a-tag :color="text === 3 ? 'yellow' :text === 2? 'orange':text === 1?'red':'blue'">
          {{ getLevelName(text) }}
        </a-tag>
      </template>
      <template #unittype="unittype">
        <a-tag
            :color="unittype === 1 ? 'purple' : unittype === 2 ? 'blue' : unittype === 3 ? 'cyan' : 'green'"
        >
          {{ unittype==1?'省级':unittype==2?'地（市、州）级':unittype==3?'区县级':unittype==4?'村（乡、镇）级':'管理员' }}
        </a-tag>
      </template >
      <template #responseStatus="text">
        <a-tag :color="text === 3 ? 'red' :text === 2? 'green':text === 1?'orange':'blue'">
          {{text == 1 ? '待叫应' : text == 2 ?'已叫应':text == 3 ?'超时未叫应' : ''}}
        </a-tag>
      </template>
      <template #forwardRate="text,record">
          {{record.forwardStatus == 1?text: '--' }}
      </template>
      <template #operation="text, record, index">
        <a-button type="primary" @click="viewDetail(record.id)">查看详情</a-button>
      </template>
    </a-table>
    <call-list-mod ref="callList"></call-list-mod>
    <a-modal
        title="响应举措"
        centered
        :visible="detailVisible"
        width="50%"
        cancelText="取消"
        @cancel="detailCancel"
        @ok="detailCancel"
    >
      <div class="detail-mod">
        <a-row :gutter="24" v-if="details.title"><a-col :span="4">标题</a-col><a-col class="noBorder" :span="14" style="font-size: 24px;font-weight: bolder">{{details.title}}</a-col></a-row>
        <a-row :gutter="24" v-if="details.publishingUnit"><a-col :span="4">发布单位</a-col><a-col :span="14">{{details.publishingUnit}}</a-col></a-row>
        <a-row :gutter="24" v-if="details.publishingTime"><a-col :span="4">发布时间</a-col><a-col :span="14">{{details.publishingTime}}</a-col></a-row>
        <a-row :gutter="24" v-if="details.baseMeasures && details.baseMeasures.length > 0"><a-col :span="4">基础措施</a-col>
          <a-col :span="14" class="noBorder">
            <div v-for="(item,index) in details.baseMeasures" :key="index">
              {{index+1}}、{{item}}
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="24" v-if="details.responseMeasure"><a-col :span="4">响应反馈</a-col><a-col :span="14">{{details.responseMeasure}}</a-col></a-row>
        <a-row :gutter="24" v-if="details.attachments && details.attachments.length > 0"><a-col :span="4">附件内容</a-col>
          <a-col :span="14" class="noBorder">
            <a-button @click="viewFile(item)" type="link" v-for="(item,index) in details.attachments" :key="index"><a-icon type="paper-clip"/>{{item.attachmentName}}</a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import {getResponseById} from "@/api/list";
import callListMod from "@/views/Admin/components/callListMod";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import {responseMeasure} from "@/api/new";
import axios from "axios";
import Cookies from "js-cookie";
export default {
  name: 'call-list-mod',
  components: { callListMod },
  data () {
    return {
      visible: false,
      detailVisible: false,
      unitType: null,
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          warnInfoId: null
        }
      },
      data: [],
      details: {},
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
        showTotal: total => `共 ${total} 条`
      },
      columns: [
          {
        title: '序号',
        dataIndex: 'index',
        scopedSlots: {
          customRender: 'index'
        }
      },
        {
          title: '接收人单位',
          dataIndex: 'receiveUnit',
          scopedSlots: { customRender: 'receiveUnit' }
        },
        {
          title: '接收人',
          dataIndex: 'recipienterName',
        },
        {
          title: '级别',
          dataIndex: 'unittype',
          scopedSlots: {
            customRender: 'unittype'
          },
        },
        {
          title: '叫应状态',
          dataIndex: 'responseStatus',
          scopedSlots: {
            customRender: 'responseStatus'
          }
        },
        {
          title: '转发叫应率',
          dataIndex: 'forwardRate',
          scopedSlots: {
            customRender: 'forwardRate'
          }
        },
        {
          title: '响应措施',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          },
        }
      ]
    }
  },
  created() {
    const t = this
  },
  methods:{
    openMod(id,type){
      const t = this
      t.visible = true
      t.unitType = type
      t.search.searchParams.warnInfoId = id
      t.getData()
      if(type == 3){
        t.columns = t.columns.filter(i=>i.dataIndex !== 'forwardRate')
      }else{
        t.columns = t.columns.filter(i=>i.dataIndex !== 'operation')
      }
    },
    async getData(){
      const t = this
      const res = await getResponseById(t.search)
      if(res.data.code == 100){
        t.data = res.data.data
        t.pagination.total = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    async viewDetail(id){
      const t = this
      const res = await responseMeasure({id:id})
      if(res.data.code == 100){
        const data = res.data.data
        if(!data.baseMeasures || data.baseMeasures.length == 0){
          t.$message.error('该记录暂无响应措施')
        }else{
          t.details = data
          t.detailVisible = true
        }
      }else{
        this.$message.error(res.data.msg)
      }
    },

    digData(id,type){
      if(id){
        this.$refs.callList.openMod(id,type)
      }else{
        this.$message.error('暂无下级叫应数据')
      }
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
      t.search.pageIndex = page
      t.getData()
    },

    handleCancel(e) {
      const t = this
      t.visible = false;
    },
    detailCancel(e){
      this.detailVisible = false
    },
    onChange(value) {
      console.log(value);
    },
    viewFile(item){
      const t = this
      const { baseUrl } = require('../../../../config/env.' + process.env.NODE_ENV)
      axios.get(baseUrl + item.attachment,{headers:{'Content-Type': 'application/json','tk': `${Cookies.get('resTk')}`,'uid':`${Cookies.get('resUid')}`},responseType: 'blob'}).then(res=>{
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
</style>
