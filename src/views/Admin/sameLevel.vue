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
            <a-button type="primary" @click="getUserList">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.name" bordered>
        <template #levels="level">
          <a-tag
            :color="level === 1 ? 'pink' : level === 2 ? 'blue' : 'green'"
          >
            {{ level === 1 ? '省级' : level === 2 ? '地（市、州）级' : level === 3 ? '区县级' : '村（乡、镇）级' }}
          </a-tag>
        </template>
        <template #area="area">
          {{findAreaById(areaData,area)}}
        </template>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn">删除</a-button>
        </template>
      </a-table>
    </div>
    <same-level-mod ref="sameLevelMod" @refrech="getUserList"></same-level-mod>
  </div>
</template>

<script>
import {getUser} from '@/api/user'
import sameLevelMod from "@/views/Admin/components/sameLevelMod"
export default {
  name: 'sameLevel',
  components: {
    sameLevelMod
  },
  data () {
    return {
      areaVal: [],
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          districtId: null
        }
      },
      columns:[
        {
          title: '单位名称',
          dataIndex: 'depName',
          key: 'depName'
        },
        {
          title: '接收人姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '级别',
          dataIndex: 'level',
          key: 'level',
          scopedSlots: { customRender: 'levels' }
        },
        {
          title: '行政区划',
          dataIndex: 'area',
          key: 'area',
          scopedSlots: { customRender: 'area' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        },
      ],
      tableData: [
        {
          depName: '阿勒泰地区自然资源局',
          name: 'John Brown',
          phone: '15261806177',
          level: 1,
          area: 111
        },
        {
          depName: '阿勒泰地区公安局',
          name: 'Jim Green',
          phone: '15261806178',
          level: 2,
          area: 211
        },
        {
          depName: '阿勒泰地区自然资源局',
          name: 'Joe Black',
          phone: '15261806176',
          level: 3,
          area: 11
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
          districtId: null
        }
      }
      t.getUserList()
    },

    editData(type,data){
      const t = this
      t.$refs.sameLevelMod.openDialog(type,data)
      t.$refs.sameLevelMod.areaData = t.areaData
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
