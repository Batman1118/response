<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="4">
        <a-button type="primary" @click="editData('add',{})">新增用户</a-button>
      </a-col>
      <a-col :span="20">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="4">
            <a-cascader :options="areaData" v-model="areaVal" placeholder="行政规划" expandTrigger="hover" :fieldNames="fieldNames" changeOnSelect @change="onChange" style="width: 100%"/>
          </a-col>
          <a-col :span="4">
            <a-select v-model="search.searchParams.unittype" placeholder="监管层级" style="width: 100%">
              <a-select-option :value="1">
                省级
              </a-select-option>
              <a-select-option :value="2">
                地（市、州）级
              </a-select-option>
              <a-select-option :value="3">
                区县级
              </a-select-option>
              <a-select-option :value="4">
                村（乡、镇）级
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-input v-model="search.searchParams.realName" placeholder="姓名" style="width: 100%"/>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="getUserList">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.id" bordered>
        <template #sex="sex">
          {{ sex == 1?'男':'女'}}
        </template>
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
        <template #role="role">
          {{ role.roleName}}
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn" @click="delData(row)">删除</a-button>
          <a-button type="link" @click="editPwd(row)">重置密码</a-button>
        </template>
      </a-table>
<!--      <a-pagination-->
<!--          :total="85"-->
<!--          :show-total="total => `Total ${total} items`"-->
<!--          :page-size="20"-->
<!--          :default-current="1"-->
<!--      />-->
    </div>
    <user-mod ref="userMod" :unitType="unittype" @refresh="getUserList"></user-mod>
    <pwd-mod ref="pwdMod" @refresh="getUserList"></pwd-mod>
  </div>
</template>

<script>
import {getUser,delUser} from '@/api/user'
import userMod from "@/views/Admin/components/userMod"
import pwdMod from "@/views/Admin/components/pwdMod";
import {getDistrictInfo, loginOut} from "@/api/login";
import {getUserInfo, Session} from "@/util/storage";
import Cookies from "js-cookie";
export default {
  name: 'user',
  components: {
    userMod,
    pwdMod
  },
  data () {
    return {
      areaVal: [],
      unittype: null,
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          realName: '',
          districtId: null,
          unittype: null
        }
      },
      columns:[
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '姓名',
          dataIndex: 'realName',
          key: 'realName'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
          scopedSlots: { customRender: 'sex' },
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
          title: '角色',
          dataIndex: 'role',
          key: 'role',
          scopedSlots: { customRender: 'role' },
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
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
    console.log(t.unittype,'unit')
    t.getUserList()
    t.getDistrictInfo()
  },
  methods:{
    async getUserList(){
      const t = this
      if(t.search.searchParams.realName == '' && t.search.searchParams.districtId == null && t.search.searchParams.unittype == null){
        const {searchParams,...data} = t.search
        const res = await getUser(data)
        if(res.data.code == 100){
          t.tableData = res.data.data
          t.pagination.total = res.data.total
        }else{
          t.$message.warning(res.data.msg);
        }
      }else{
        const res = await getUser(t.search)
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

    async delData(row){
      const t = this
      this.$confirm({
        title: '提示',
        content: h => <div>是否删除该条用户信息？</div>,
        cancelText: '取消',
        okText: '确认',
        centered: true,
        onOk() {
          delUser(row.id).then(res=>{
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

    resetSearch(){
      const t = this
      t.areaVal = []
      t.search = {
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          realName: '',
          districtId: null,
          unittype: null
        }
      }
      t.getUserList()
    },

    editData(type,data){
      const t = this
      t.$refs.userMod.openDialog(type,data)
      t.$refs.userMod.areaData = t.areaData
    },

    editPwd(record){
      const t = this
      t.$refs.pwdMod.form.uid = record.id
      t.$refs.pwdMod.updateType = 2
      t.$refs.pwdMod.visible = true
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
      t.search.pageIndex = page
      t.getUserList()
    },
    onChange(value) {
      const t = this
      t.search.searchParams.districtId = value[value.length - 1]
      console.log(value,'val')
    },
    findAreaById(data,value) {
      for (const node of data) {
        if (node.value === value) {
          return node.label;
        }
        if (node.children) {
          const foundLabel = this.findAreaById(node.children, value);
          if (foundLabel) {
            return foundLabel;
          }
        }
      }
      return null;
    }
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
