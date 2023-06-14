<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="search.searchParams.reviewStatus" @change="getData">
          <a-radio-button :value="null">
            全部
          </a-radio-button>
          <a-radio-button :value="2">
            审核通过
          </a-radio-button>
          <a-radio-button :value="1">
            未审核
          </a-radio-button>
          <a-radio-button :value="3">
            审核驳回
          </a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="16">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="8">
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
      </a-col>
    </a-row>

    <div class="table-cont">
      <a-table :columns="columns" :data-source="data" bordered :rowKey="record=>record.id">
        <template #index="text,record,index">
          {{ index+1 }}
        </template>
        <template #disasterType="text">
          {{ getRiskName(text) }}
        </template>
        <template #attachment="text">
          <span v-if="text==='无'">无</span>
          <a v-else><b><a-icon type="paper-clip" /> {{text}}</b></a>
        </template >
        <template #reviewStatus="reviewStatus">
          <a-tag
              :color="reviewStatus === 1 ? 'blue' : reviewStatus === 2 ? 'green' : 'red'"
          >
            {{ reviewStatus==1?'未审核':reviewStatus==2?'已审核':reviewStatus==3?'审核驳回':'' }}
          </a-tag>
        </template>
        <template #operation="text, record, index">
          <a-button type="link" v-if="record.reviewStatus == 2 || record.reviewStatus == 3" @click="openMod('view',record)">查看信息详情</a-button>
          <a-button type="primary" v-if="record.reviewStatus == 1" @click="openMod('review',record)">查看并审核</a-button>
        </template>
      </a-table>
    </div>
    <msg-edit-mod ref="msgEdit" @refresh="getData"></msg-edit-mod>
  </div>
</template>

<script>

import {getReviewDetail, getReviewRecord} from "@/api/review";
import msgEditMod from '@/views/Admin/components/msgEditMod'

export default {
  name: 'msgReview',
  components: { msgEditMod },
  data () {
    return {
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          reviewStatus: null,
          startTime: '',
          endTime: ''
        }
      },
      timeRange: [],
      riskOptions: [
        {name: '地震',value: 1},
        {name: '洪涝',value: 2},
        {name: '气象',value: 3},
        {name: '泥石流',value: 4},
        {name: '水旱',value: 5},
        {name: '森林草原火灾',value: 6}
      ],
      columns: [
        {
          title: '序号',
          key: 'index',
          scopedSlots: {
            customRender: 'index'
          },
        },
        {
          title: '提交审核时间',
          key: 'gmtReviewSubmit',
          dataIndex: 'gmtReviewSubmit',
        },
        {
          title: '发布单位',
          key: 'publishingUnit',
          dataIndex: 'publishingUnit',
        },
        {
          title: '灾种',
          dataIndex: 'disasterType',
          key: 'disasterType',
          scopedSlots: {
            customRender: 'disasterType'
          }, //设置定制化表格数据
        },
        {
          title: '信息标题',
          key: 'title',
          dataIndex: 'title',
        },
        {
          title: '附件',
          key: 'attachment',
          dataIndex: 'attachment',
          scopedSlots: {
            customRender: 'attachment'
          },
        },
        {
          title: '审核情况',
          dataIndex: 'reviewStatus',
          scopedSlots: {
            customRender: 'reviewStatus'
          }, //设置定制化表格数据
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation'
          },
        },
      ],
      data: []
    }
  },
  created() {
    const t = this
    t.getData()
  },
  methods:{
    async getData(){
      const t = this
      const res = await getReviewRecord(this.search)
      if(res.data.code == 100){
        t.data = res.data.data
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
          reviewStatus: null,
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

    openMod(type,data){
      const t = this
      getReviewDetail(data.id).then(res=>{
        if(res.data.code == 100){
          t.$refs.msgEdit.openMod(type,res.data.data)
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },

    onOk(value) {
      console.log('onOk: ', value);
    },
    getRiskName(disasterType){
      return this.riskOptions.find(i => i.value === disasterType)?.name;
    }

  }
}
</script>

<style lang="less" scoped>

</style>
