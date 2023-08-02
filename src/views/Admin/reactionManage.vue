<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="4">
        <a-button type="primary" @click="editData('add',{})">新增</a-button>
      </a-col>
      <a-col :span="20">
        <a-row type="flex" justify="end" :gutter="12">
<!--          <a-col :span="4">-->
<!--            <a-input v-model="search.searchParams.realName" placeholder="姓名" style="width: 100%"/>-->
<!--          </a-col>-->
<!--          <a-col :span="4">-->
<!--            <a-button type="primary" @click="getUserList">查询</a-button>-->
<!--            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>-->
<!--          </a-col>-->
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.id" bordered>
        <template #disasterType="type">
            {{ getRiskName(type) }}
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn" @click="delData(row)">删除</a-button>
        </template>
      </a-table>
    </div>
    <reaction-mod ref="reactRef" @refresh="getMeasureList()"></reaction-mod>
  </div>
</template>

<script>
import {getMeasure,addMeasure,delMeasure} from '@/api/new'
import {getUserInfo} from "@/util/storage"
import ReactionMod from "@/views/Admin/components/reactionMod";
import Cookies from "js-cookie";

export default {
  name: 'reactionManage',
  components: { ReactionMod },
  data () {
    return {
      unittype: null,
      search:{
        pageIndex: 1,
        pageSize: 10
      },
      columns:[
        {
          title: '所属灾种',
          dataIndex: 'disasterType',
          key: 'disasterType',
          scopedSlots: { customRender: 'disasterType' }
        },
        {
          title: '措施内容',
          dataIndex: 'measure',
          key: 'measure'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        },
      ],
      riskOptions: [
        {
          name: '地震',
          value: 1
        },
        {
          name: '气象',
          value: 3
        },
        {
          name: '地质灾害',
          value: 4
        },
        {
          name: '水旱',
          value: 5
        },
        {
          name: '森林草原火灾',
          value: 6
        }
      ],
      tableData: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
        showTotal: total => `共 ${total} 条`
      }
    }
  },
  created() {
    const t = this
    t.unittype = getUserInfo().unittype
    t.getMeasureList()
  },
  methods:{
    async getMeasureList(){
      const t = this
      const res = await getMeasure(t.search)
      if(res.data.code == 100){
        t.tableData = res.data.data
        t.pagination.total = res.data.total
      }else{
        t.$message.warning(res.data.msg);
      }
    },

    getRiskName(type){
      return this.riskOptions.find(i=>i.value == type)?.name
    },

    async delData(row){
      const t = this
      this.$confirm({
        title: '提示',
        content: h => <div>是否删除该条响应措施？</div>,
        cancelText: '取消',
        okText: '确认',
        centered: true,
        onOk() {
          delMeasure(row.id).then(res=>{
            if(res.data.code == 100){
              t.$message.success('删除响应措施成功');
              t.getMeasureList()
            }else{
              t.$message.warning(res.data.msg);
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },

    resetSearch(){
      const t = this
      t.search = {
        pageIndex: 1,
        pageSize: 10
      }
      t.getMeasureList()
    },

    editData(type,data){
      const t = this
      t.$refs.reactRef.openDialog(type,data)
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
      t.search.pageIndex = page
      t.getMeasureList()
    }
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
