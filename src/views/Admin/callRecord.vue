<template>
  <div class="inner">
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" :rowKey="record=>record.id" bordered>
        <template #level="level">
          <a-tag
              :key="level"
              :color="level === 1 ? 'pink' : level === 2 ? 'blue' : 'green'"
          >
            {{ level==1?'省级':level==2?'地（市、州）级':level==3?'区县级':'村（乡、镇）级' }}
          </a-tag>
        </template>
        <template #actions="actions,row">
          <a-button type="link" @click="viewData()">查看</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
        title="信息详情"
        :visible="visible"
        @ok="handleOk"
        @cancel="handleCancel"
        cancelText="取消" okText="确认"
        width="50%"
    >
      <a-row class="tit">
        <a-col :span="4" style="text-align: right;padding-right: 8px">标题</a-col>
        <a-col :span="14">信息详情标题</a-col>
      </a-row>
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
        <a-form-model-item label="类别">
          <a-input readonly v-model="form.type"/>
        </a-form-model-item>
        <a-form-model-item label="级别">
          <a-tag color="yellow">黄色</a-tag>
        </a-form-model-item>
        <a-form-model-item label="发布单位">
          <a-input readonly v-model="form.dep"/>
        </a-form-model-item>
        <a-form-model-item label="短信内容">
          <a-input readonly type="textarea" v-model="form.content"/>
        </a-form-model-item>
        <a-form-model-item label="附件内容">
          <a><b><a-icon type="paper-clip"/>附件</b></a>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {getUser} from '@/api/user'

export default {
  name: 'callRecord',
  components: {},
  data () {
    return {
      visible: false,
      form: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      columns:[
        {
          title: '叫应时间',
          dataIndex: 'callTime',
          key: 'callTime'
        },
        {
          title: '预警信息',
          dataIndex: 'warnings',
          key: 'warnings'
        },
        {
          title: '接收人单位',
          dataIndex: 'depName',
          key: 'depName'
        },
        {
          title: '接收人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '级别',
          dataIndex: 'level',
          key: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ],
      tableData: [
        {
          id: 1,
          callTime: '2023-06-02',
          warnings: '666666',
          name: '黄公子',
          level: 1
        },
        {
          id: 2,
          callTime: '2023-06-02',
          warnings: '666666',
          name: '黄公子',
          level: 2
        },
        {
          id: 3,
          callTime: '2023-06-02',
          warnings: '666666',
          name: '黄公子',
          level: 4
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
  },
  methods:{
    async getUserList(){
      const t = this
      const res = await getUser(t.search)
    },


    viewData(){
      const t = this
      t.visible = true
    },

    onPageChange(page, pageSize) {
      const t= this
      t.pagination.current = page
    },

    handleOk(e) {
      this.visible = false
    },
    handleCancel(e) {
      this.visible = false;
    },
  }
}
</script>

<style lang="less" scoped>
  .tit{
    font-size: 18px;
    font-weight: bolder;
    color: @blackText;
    margin-bottom: 24px;
  }
</style>
