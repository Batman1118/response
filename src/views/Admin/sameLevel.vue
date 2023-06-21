<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="4">
        <a-button v-if="unittype && unittype !== null" type="primary" @click="editData('add',{})">新增用户</a-button>
      </a-col>
      <a-col :span="20" v-if="unittype == null || !unittype">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="4">
            <a-cascader :options="areaData" v-model="areaVal" placeholder="行政规划" expandTrigger="hover" :fieldNames="fieldNames" changeOnSelect @change="onChange" style="width: 100%"/>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="getUserList">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.name" bordered>
        <template #unittype="unittype">
          <a-tag
              :color="unittype === 1 ? 'purple' : unittype === 2 ? 'blue' : unittype === 3 ? 'cyan' : 'green'"
          >
            {{ unittype==1?'省级':unittype==2?'地（市、州）级':unittype==3?'区县级':unittype==4?'村（乡、镇）级':'管理员' }}
          </a-tag>
        </template>
        <template #area="text,row">
          <span v-if="row.province !== null && row.province !== ''">{{row.province}}</span>
          <span v-if="row.city !== null && row.city !== ''">-{{row.city}}</span>
          <span v-if="row.area !== null && row.area !== ''">-{{row.area}}</span>
          <span v-if="row.town !== null && row.town !== ''">-{{row.town}}</span>
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn" @click="delData(row)">删除</a-button>
        </template>
      </a-table>
    </div>
    <same-level-mod ref="sameLevelMod" @refresh="getUserList"></same-level-mod>
  </div>
</template>

<script>
import {delRecipient, delUser, getRecipient, getUser} from '@/api/user'
import sameLevelMod from "@/views/Admin/components/sameLevelMod"
import {getUserInfo} from "@/util/storage";
import {getDistrictInfo} from "@/api/login";
export default {
  name: 'sameLevel',
  components: {
    sameLevelMod
  },
  data () {
    return {
      areaVal: [],
      unittype: null,
      districtId: null,
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          province: '',
          city: '',
          area: '',
          town: ''
        }
      },
      columns:[
        {
          title: '单位名称',
          dataIndex: 'company',
          key: 'company'
        },
        {
          title: '接收人姓名',
          dataIndex: 'recipientName',
          key: 'recipientName'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '级别',
          dataIndex: 'unittype',
          // key: 'unittype',
          scopedSlots: { customRender: 'unittype' }
        },
        {
          title: '行政区划',
          dataIndex: 'area',
          // key: 'area',
          scopedSlots: { customRender: 'area' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        },
      ],
      tableData: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
        showTotal: total => `共 ${total} 条`
      },
      areaData: [],
      fieldNames:{
        label: 'name',
        value: 'id',
        children: 'children'
      }
    }
  },
  created() {
    const t = this
    t.unittype = getUserInfo().unittype
    t.districtId = getUserInfo().districtId
    t.getUserList()
    t.getDistrictInfo()
  },
  methods:{
    async getUserList(){
      const t = this
      if(t.search.searchParams.province == '' && t.search.searchParams.city == '' && t.search.searchParams.area == '' ){
        const {searchParams,...data} = t.search
        const res = await getRecipient(data)
        if(res.data.code == 100){
          t.tableData = res.data.data
          t.pagination.total = res.data.total
        }else{
          t.$message.warning(res.data.msg);
        }
      }else{
        const res = await getRecipient(t.search)
        if(res.data.code == 100){
          t.tableData = res.data.data
          t.pagination.total = res.data.total
        }else{
          t.$message.warning(res.data.msg);
        }
      }
    },

    async getDistrictInfo(){
      let res = await getDistrictInfo()
      if(res.data.code == 100){
        this.areaData = res.data.data
      } else {
        this.$message.warning(res.data.msg);
      }
    },

    resetSearch(){
      const t = this
      t.areaVal = []
      t.search = {
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          province: '',
          city: '',
          area: '',
          town: ''
        }
      }
      t.getUserList()
    },

    editData(type,data){
      const t = this
      t.$refs.sameLevelMod.openDialog(type,data)
      t.$refs.sameLevelMod.areaData = t.areaData
      t.$refs.sameLevelMod.form.unittype = t.unittype
      t.$refs.sameLevelMod.form.districtId = t.districtId
    },

    async delData(row){
      const t = this
      this.$confirm({
        title: '提示',
        content: h => <div>是否删除该条用户信息？</div>,
        cancelText: '取消',
        okText: '确认',
        centered: true,
        onOk() {
          delRecipient(row.id).then(res=>{
            if(res.data.code == 100){
              t.$message.success('删除用户信息成功');
              t.getUserList()
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

    // 根据id查对象
    findCodeById(data,value) {
      for (const node of data) {
        if (node.id === value) {
          return node;
        }
        if (node.children) {
          const foundNode = this.findCodeById(node.children, value);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
      t.search.pageIndex = page
      t.getUserList()
    },
    onChange(value) {
      const t = this
      t.search.searchParams = {
        province: '',
        city: '',
        area: '',
        town: ''
      }
      if(value[0]){
        t.search.searchParams.province = t.findCodeById(t.areaData,value[0]).name
      }
      if(value[1]){
        t.search.searchParams.city = t.findCodeById(t.areaData,value[1]).name
      }
      if(value[2]){
        t.search.searchParams.area = t.findCodeById(t.areaData,value[2]).name
      }
      if(value[3]){
        t.search.searchParams.town = t.findCodeById(t.areaData,value[3]).name
      }
    },
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
