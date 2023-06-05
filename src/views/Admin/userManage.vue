<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="4">
        <a-button type="primary" @click="editData('add',{})">新增用户</a-button>
      </a-col>
      <a-col :span="20">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="4">
            <a-cascader :options="areaData" v-model="areaVal" placeholder="行政规划" expandTrigger="hover" changeOnSelect @change="onChange" style="width: 100%"/>
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
          {{ sex == 0?'男':'女' }}
        </template>
        <template #level="level">
          <a-tag
              :key="level"
              :color="level === 1 ? 'pink' : level === 2 ? 'blue' : 'green'"
          >
            {{ level==1?'省级':level==2?'地（市、州）级':level==3?'区县级':'村（乡、镇）级' }}
          </a-tag>
        </template>
        <template #area="area">
          {{findAreaById(areaData,area)}}
        </template>
        <template #role="role">
          {{ role == 1?'领导':'工作人员'}}
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn">删除</a-button>
          <a-button type="link" @click="editPwd(row)">重置密码</a-button>
        </template>
      </a-table>
    </div>
    <user-mod ref="userMod" @refrech="getUserList"></user-mod>
    <pwd-mod ref="pwdMod" @refrech="getUserList"></pwd-mod>
  </div>
</template>

<script>
import {getUser} from '@/api/user'
import userMod from "@/views/Admin/components/userMod"
import pwdMod from "@/views/Admin/components/pwdMod";
export default {
  name: 'user',
  components: {
    userMod,
    pwdMod
  },
  data () {
    return {
      areaVal: [],
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          realName: '',
          districtId: null,
          unittype: undefined
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
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
          scopedSlots: { customRender: 'sex' },
        },
        {
          title: '级别',
          dataIndex: 'level',
          key: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '行政区划',
          dataIndex: 'area',
          key: 'area',
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
      tableData: [
        {
          id: 1,
          name: 'John Brown',
          phone: '15261806177',
          userName: 'JBrown',
          sex: 0,
          level: 1,
          area: 111,
          role: 1
        },
        {
          id: 2,
          name: 'Jim Green',
          phone: '15261806178',
          userName: 'JGreen',
          sex: 1,
          level: 2,
          area: 211,
          role: 2
        },
        {
          id: 3,
          name: 'Joe Black',
          phone: '15261806176',
          userName: 'JBlack',
          sex: 0,
          level: 3,
          area: 11,
          role: 1
        },
      ],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 11,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize)
      },
      areaData: [
        {
          value: 1,
          label: '江苏省',
          children: [
            {
              value: 11,
              label: '苏州市',
              children: [
                {
                  value: 111,
                  label: '工业园区',
                },
              ],
            },
          ],
        },
        {
          value: 2,
          label: '新疆维吾尔自治区',
          children: [
            {
              value: 21,
              label: '乌鲁木齐市',
              children: [
                {
                  value: 211,
                  label: '国泰新华',
                },
              ],
            },
          ],
        },
      ]
    }
  },
  created() {
    const t = this
    t.getUserList()
  },
  methods:{
    async getUserList(){
      const t = this
      const res = await getUser(t.search)
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
          unittype: undefined
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
      t.$refs.pwdMod.form.id = record.id
      t.$refs.pwdMod.visible = true
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
    },
    onChange(value) {
      const t = this
      t.search.searchParams.districtId = value[value.length - 1]
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
