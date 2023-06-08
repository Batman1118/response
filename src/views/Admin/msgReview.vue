<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="category">
          <a-radio-button :value="0">
            全部
          </a-radio-button>
          <a-radio-button :value="1">
            审核通过
          </a-radio-button>
          <a-radio-button :value="2">
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
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="timeChange"
                @ok="timeOk"
                style="width: 100%"
            />
          </a-col>
          <a-col :span="4">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 12px">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <div class="table-cont">
      <a-table :columns="columns" :data-source="data" bordered>
        <template #level="level">
          <a-tag :color="level === '黄色' ? 'yellow' :level === '橙色'? 'orange':level === '红色'?'red':'blue'">
            {{ level }}
          </a-tag>
        </template>
        <template #attachment="text">
          <span v-if="text==='无'">无</span>
          <a v-else><b><a-icon type="paper-clip" /> {{text}}</b></a>
        </template >
        <template #status="status">
          <a-tag
              :color="status === 1 ? 'green' : status === 2 ? 'blue' : 'red'"
          >
            {{ status==1?'审核通过':status==2?'未审核':'审核驳回' }}
          </a-tag>
        </template>
        <template #operation="text, record, index">
          <a-button type="link" v-if="record.status == 1 || record.status == 3">查看信息详情</a-button>
          <a-button type="primary" v-if="record.status == 2">查看并审核</a-button>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script>

export default {
  name: 'msgReview',
  components: {},
  data () {
    return {
      category: 0,
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          width: '5%',
        },
        {
          title: '提交审核时间',
          dataIndex: 'time',
          width: '15%',
          scopedSlots: {
            customRender: 'time'
          }, //设置定制化表格数据
        },
        {
          title: '发布单位',
          dataIndex: 'department',
          width: '12%',
        },
        {
          title: '类别',
          dataIndex: 'category',
          width: '8%',
        },
        {
          title: '级别',
          dataIndex: 'level',
          scopedSlots: {
            customRender: 'level'
          }, //设置定制化表格数据
          width: '8%',
        },
        {
          title: '信息标题',
          dataIndex: 'title',
          width: '16%',
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          width: '6%',
          scopedSlots: {
            customRender: 'attachment'
          },
        },
        {
          title: '审核情况',
          dataIndex: 'status',
          width: '10%',
          scopedSlots: {
            customRender: 'status'
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
      data: [
        {
          key: 1,
          id:1001,
          time: '2023-05-02 15:30',
          department: '自治区预警中心',
          category: '气象',
          level: '黄色',
          title: '全疆高温红色预警',
          attachment: '1',
          status: 1
        },
        {
          key: 2,
          id:1002,
          time: '2023-05-02 15:30',
          department: '自治区预警中心',
          category: '气象',
          level: '橙色',
          title: '全疆高温红色预警',
          attachment: '1',
          status: 2
        },
        {
          key: 3,
          id:1003,
          time: '2023-05-02 15:30',
          department: '自治区预警中心',
          category: '气象',
          level: '橙色',
          title: '全疆高温红色预警',
          attachment: '1',
          status: 3
        }
      ]
    }
  },
  created() {
    const t = this
  },
  methods:{
    timeChange(date, dateString) {
      console.log(date, dateString);
    },
    timeOk(value) {
      console.log('timeOk: ', value);
    },
  }
}
</script>

<style lang="less" scoped>

</style>
