<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="4">
        <a-button type="primary" @click="editData('add',{})">新增菜单</a-button>
      </a-col>
      <a-col :span="20">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="4">
            <a-input v-model="search.searchParams.name" placeholder="菜单名称" style="width: 100%"/>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="getUserList">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table
          :columns="columns"
          :data-source="tableData"
          :rowKey="record=>record.id" bordered
      >
        <template #type="type">
          <a-tag color="pink">
            {{type}}
          </a-tag>
        </template>
<!--        <template v-slot="type">-->
<!--          <a-tag color="pink">-->
<!--            {{type}}-->
<!--          </a-tag>-->
<!--        </template>-->
        <template #action="text, row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn">删除</a-button>
        </template>
      </a-table>
    </div>
    <user-mod ref="userMod" @refresh="getUserList"></user-mod>
    <pwd-mod ref="pwdMod" @refresh="getUserList"></pwd-mod>
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
          name: ''
        }
      },
      columns:[
        {
          title: '菜单名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '路由路径',
          dataIndex: 'route',
          key: 'route'
        },
        {
          title: '组件路径',
          dataIndex: 'path',
          key: 'path'
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
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
          name: '首页',
          route: '/index',
          path: '/index',
          type: 1,
          children: [
            {
              id: 2,
              name: '控制面板',
              route: '/panel',
              path: '/panel',
              type: 2
            },
            {
              id: 3,
              name: '实时气象',
              route: '/weather',
              path: '/weather',
              type: 1
            }
          ]
        },
        {
          id: 4,
          name: '预警信息管理',
          route: '/warning',
          path: '/warning',
          type: 1,
          children: [
            {
              id: 5,
              name: '信息编辑',
              route: '/msgEdit',
              path: '/msgEdit',
              type: 1
            },
            {
              id: 6,
              name: '信息审核',
              route: '/msgReview',
              path: '/msgReview',
              type: 1
            }
          ]
        },
      ],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 11,
        onChange: ( page, pageSize ) => this.onPageChange(page,pageSize)
      }
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
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
