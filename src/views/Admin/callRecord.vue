<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="search.searchParams.emergType" @change="getData">
          <a-radio-button :value="null">
            全部
          </a-radio-button>
          <a-radio-button :value="1">
            紧临
          </a-radio-button>
          <a-radio-button :value="2">
            常规
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
                @ok="timeOk"
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

    <!-- 表格实体部分-->
    <div class="table-cont">
      <a-table :columns="columns" :data-source="data" bordered :pagination="pagination" :rowKey="record=>record.id">
        <template #index="text,record,index">
          {{ index + 1 }}
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
        <template #operation="text, record, index">
          <a-button type="link" @click="openDetails(record.warnInfoId)">查看详情</a-button>
        </template>
      </a-table>
      <msg-detail-mod ref="msgDetail"></msg-detail-mod>
    </div>
  </div>
</template>
<script>
import {getHistoryRecord, getMsgRecord, getPublishRecord, getResponseRecord} from "@/api/list";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import {getUserInfo} from "@/util/storage";

const columns = [{
  title: '序号',
  dataIndex: 'index',
  width: '8%',
  scopedSlots: {
    customRender: 'index'
  }
},
  {
    title: '叫应时间',
    dataIndex: 'responseTime',
    width: '15%',
    scopedSlots: {
      customRender: 'responseTime'
    } //设置定制化表格数据
  },
  {
    title: '预警级别',
    dataIndex: 'warningLevel',
    scopedSlots: {
      customRender: 'warningLevel'
    }, //设置定制化表格数据
    width: '8%',
  },
  {
    title: '发布单位',
    dataIndex: 'publishingUnit',
    width: '20%',
  },
  {
    title: '接收人单位',
    dataIndex: 'receiveUnit',
    width: '20%',
    scopedSlots: {
      customRender: 'receiveUnit'
    }
  },
  {
    title: '接收人',
    dataIndex: 'responseRealName',
    width: '20%',
    scopedSlots: {
      customRender: 'responseRealName'
    }
  },
  {
    title: '级别',
    dataIndex: 'unittype',
    width: '12%',
    scopedSlots: {
      customRender: 'unittype'
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {
      customRender: 'operation'
    },
  },
];
export default {
  name: 'release',
  components: { msgDetailMod },
  data() {
    return {
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          emergType: null,
          startTime: '',
          endTime: ''
        }
      },
      timeRange: [],
      category: 'default',
      data:[],
      columns,
      visible: false,
      confirmLoading: false,
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
        showTotal: total => `共 ${total} 条`
      },
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
  mounted() {
    if(getUserInfo().role.id == 1){
      this.columns = this.columns.filter(i=>i.dataIndex !== 'operation')
    }
  },
  created() {
    const t = this
    t.getData()
  },
  methods: {
    async getData(){
      const t = this
      const res = await getResponseRecord(this.search)
      if(res.data.code == 100){
        t.data = res.data.data
        t.pagination.total = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    openDetails(id){
      const t = this
      t.$refs.msgDetail.getDetails(id)
      t.$refs.msgDetail.visible = true
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
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

    timeOk(value) {
      console.log('onOk: ', value);
    },

    resetSearch(){
      const t = this
      t.search = {
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          emergType: null,
          startTime: '',
          endTime: ''
        }
      }
      t.timeRange = []
      t.getData()
    },

    //弹出层
    showModal() {
      this.visible = true;
    },

    handleOk(e) {
      this.visible = false;
    },

    getLevelName(warningLevel){
      return this.levelOptions.find(i => i.value === warningLevel)?.name;
    }

  }
}

</script>