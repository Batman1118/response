<template>
  <a-modal
      title="叫应列表"
      centered
      :visible="visible"
      width="50%"
      cancelText="取消"
      @cancel="handleCancel"
  >
    <a-table :columns="columns" :data-source="data" bordered :pagination="pagination">
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
    </a-table>
  </a-modal>
</template>

<script>
import {getResponseById} from "@/api/list";
export default {
  name: 'callListMod',
  data () {
    return {
      visible: false,
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          warnInfoId: null
        }
      },
      data: [],
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
        width: '8%',
        scopedSlots: {
          customRender: 'index'
        }
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
          dataIndex: 'recipienterName',
          width: '20%',
          scopedSlots: {
            customRender: 'recipienterName'
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
          title: '叫应时间',
          dataIndex: 'responseTime',
          width: '15%',
          scopedSlots: {
            customRender: 'responseTime'
          } //设置定制化表格数据
        }
      ]
    }
  },
  created() {
    const t = this
  },
  methods:{
    openMod(id){
      const t = this
      t.visible = true
      t.search.searchParams.warnInfoId = id
      t.getData()
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
    onChange(value) {
      console.log(value);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
