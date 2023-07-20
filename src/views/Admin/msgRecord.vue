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
        <a-button type="primary" @click="searchData()">查询</a-button>
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
			发送人数：{{item.recipients.length}}
          </template>
          <p>
            {{item.content}}
          </p>
          <template #actions>
            <div>
              接收号码：<span>{{item.recipients.map(i=>i.realName + '(' + i.phone + ')').join('、')}}</span>
            </div>
            <div>
              <a-button type="primary" @click="viewDetails(item)">查看详情</a-button>
            </div>
          </template>
        </a-card>
      </div>
    </div>
    <a-pagination class="pageItem" v-model="search.pageIndex" :total="total" :defaultPageSize="search.pageSize" @change="onPageChange" :show-total="total => `共 ${total} 条数据`"/>
    <msg-detail-mod ref="msgDetail"></msg-detail-mod>
  </div>
</template>

<script>
import {getUser} from '@/api/user'
import {getMassRecord} from "@/api/send";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";

export default {
  name: 'msgRecord',
  components: {msgDetailMod},
  data () {
    return {
      search:{
        pageIndex: 1,
        pageSize: 5,
        searchParams:{
          startTime: '',
          endTime: ''
        }
      },
      timeRange: [],
      total: null,
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
        t.total = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    searchData(){
      this.search.pageIndex = 1
      this.getData()
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

    onPageChange(page, pageSize) {
      const t= this
      t.search.pageIndex = page
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
      t.$refs.msgDetail.details = item
      t.$refs.msgDetail.visible = true
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
        color: @base
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

</style>
