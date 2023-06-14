<template>
  <div class="inner">
    <a-row type="flex" :gutter="12" style="margin-bottom: 20px">
      <a-col :span="6">
        <a-range-picker
            v-model="timeRange"
            format="YYYY-MM-DD"
            :placeholder="['开始时间', '结束时间']"
            @change="timeChange"
            @ok="onOk"
            style="width: 100%"
        />
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="getData">查询</a-button>
        <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
      </a-col>
    </a-row>
    <div class="table-cont">
      <div class="msg">
        <a-card hoverable class="msg-item" v-for="item in msg" :key="item.id">
          <template #title>
            <div class="tit">
              发送时间：<span>{{item.gmtCreate}}</span>
            </div>
            <a-divider type="vertical" />
            <div class="tit">
              任务ID：<span>{{item.id}}</span>
            </div>
          </template>
          <p>
            {{item.content}}
          </p>
          <template #actions>
            <div>
              接收号码：<span>{{item.recipients.map(i=>i.name + '(' + i.phone + ')').join('、')}}</span>
            </div>
            <div>
              <a-button type="primary" @click="viewDetails(item)">查看详情</a-button>
            </div>
          </template>
        </a-card>
      </div>
    </div>
    <a-pagination v-model="search.pageIndex" :total="total" :show-total="total => `共 ${total} 条数据`" show-less-items/>
    <a-modal v-model="visible" width="40%" title="短信详情" @ok="handleOk" cancelText="取消" okText="确认" centered>
      <div class="detail-mod">
        <a-row :gutter="24"><a-col :span="4" style="text-align: right">{{ details.emergType == 1?'紧急':details.emergType == 2?'常规':'' }}</a-col></a-row>
        <a-row :gutter="24"><a-col :span="4" style="text-align: right">发送时间</a-col><a-col :span="14" style="border: 1px solid #d9d9d9;padding: 5px 10px !important;">{{details.gmtCreate}}</a-col></a-row>
        <a-row :gutter="24"><a-col :span="4" style="text-align: right">灾种类型</a-col><a-col :span="14" style="border: 1px solid #d9d9d9;padding: 5px 10px !important;">{{ getRiskName(details.disasterType)}}</a-col></a-row>
        <a-row :gutter="24"><a-col :span="4" style="text-align: right">预警级别</a-col><a-col :span="14" style="border: 1px solid #d9d9d9;padding: 5px 10px !important;">{{ getLevelName(details.warningLevel)}}</a-col></a-row>
        <a-row :gutter="24"><a-col :span="4" style="text-align: right">信息内容</a-col><a-col :span="14" style="border: 1px solid #d9d9d9;padding: 5px 10px !important;">{{details.content}}</a-col></a-row>
        <a-row :gutter="24">
          <a-col :span="4" style="text-align: right">接收人</a-col>
          <a-col :span="20" style="border: 1px solid #d9d9d9;padding: 0 !important;">
            <div v-for="(item,index) in details.recipients" :key="index" class="table">
            <div style="width: 20%">
              {{item.name}}
            </div>
            <div style="width: 20%">
              {{item.phone}}
            </div>
            <div style="width: 60%">
              {{item.recipientUnit}}
            </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {getUser} from '@/api/user'
import {getMassRecord} from "@/api/send";

export default {
  name: 'msgRecord',
  components: {},
  data () {
    return {
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          startTime: '',
          endTime: ''
        }
      },
      timeRange: [],
      total: 0,
      msg: [],
      visible: false,
      details: {},
      riskOptions: [
        {name: '地震',value: 1},
        {name: '洪涝',value: 2},
        {name: '气象',value: 3},
        {name: '泥石流',value: 4},
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
    t.getData()
  },
  methods:{
    async getData(){
      const t = this
      const res = await getMassRecord(this.search)
      if(res.data.code == 200){
        t.msg = res.data.data
        t.pagination.total = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    resetSearch(){
      const t = this
      t.search = {
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          startTime: '',
          endTime: ''
        }
      }
      t.timeRange = []
      t.getData()
    },

    timeChange(value, dateString) {
      const t = this
      if(dateString){
        t.search.searchParams.startTime = value[0].format('YYYY-MM-DD 00:00:00')
        t.search.searchParams.endTime = value[1].format('YYYY-MM-DD 23:59:59')
      }
    },
    onOk(value) {
      console.log('onOk: ', value);
    },
    viewDetails(item){
      const t = this
      t.details = item
      t.visible = true
    },

    getRiskName(disasterType){
      return this.riskOptions.find(i => i.value === disasterType)?.name;
    },
    getLevelName(warningLevel){
      return this.levelOptions.find(i => i.value === warningLevel)?.name;
    },

    handleOk(e) {
      console.log(e);
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.msg{
  width: 100%;
  margin-bottom: 12px;

  .msg-item{
    width: 100%;
    margin-bottom: 24px;

    /deep/.ant-card-head-title{
      display: flex !important;
      align-items: center !important;
      .tit{
        width: 50%;
      }
    }
    /deep/ .ant-card-actions{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      li{
        width: 10% !important;
      }
      &>li:first-of-type{
        width: 90% !important;

        div{
          color: #333;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
.detail-mod{
  font-size: 16px;

  .ant-row{
    margin-bottom: 24px;

    .table{
      display: flex;
      align-items: center;
      border-bottom: 1px solid @blackBorder;
      &:last-of-type{
        border-bottom: none;
      }
      &>div{
        border-right: 1px solid @blackBorder;
        padding: 5px 10px;
        &:last-of-type{
          border-right: none;
        }
      }
    }
  }
}

</style>
