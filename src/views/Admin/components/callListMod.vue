<template>
  <a-modal
      title="叫应列表"
      centered
      :visible="visible"
      width="50%"
      cancelText="取消"
      @cancel="handleCancel"
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
  </a-modal>
</template>

<script>
import {getResponseById} from "@/api/list";
import callListMod from "@/views/Admin/components/callListMod";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import {responseMeasure} from "@/api/new";
export default {
  name: 'call-list-mod',
  components: { callListMod },
  data () {
    return {
      visible: false,
      unitType: null,
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
        if(!data.baseMeasureIds){
          t.$message.error('该记录暂无响应措施')
        }else{
          console.log('666')
        }
      }else{
        this.$message.error(res.data.msg)
      }
    },

    digData(id,type){
      this.$refs.callList.openMod(id,type)
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
