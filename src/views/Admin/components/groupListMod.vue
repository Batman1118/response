<template>
  <a-modal
      title="分组管理"
      :visible="visible"
      centered
      :confirm-loading="confirmLoading"
      width="50%"
      cancelText="取消"
      okText="确认"
      @ok="handleOk"
      @cancel="handleCancel"
      :afterClose="refreshGroup"
  >
    <a-button type="primary" @click="editData('add',{})" style="margin-bottom: 12px">新增分组</a-button>
    <div class="table-cont">
      <a-table :columns="columns" :data-source="tableData" :pagination="false" :rowKey="record=>record.id" bordered>
        <template #action="action,row">
          <a-button type="link" @click="editData('edit',row)">编辑</a-button>
          <a-button type="link" class="delBtn" @click="delData(row)">删除</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
        :title="editTitle"
        :visible="editVisible"
        centered
        :confirm-loading="confirmLoading"
        width="30%"
        cancelText="取消"
        okText="确认"
        @ok="onSubmit"
        @cancel="editVisible = false"
        :afterClose="clearMod"
    >
      <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
        <a-form-model-item label="分组名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-modal>
</template>

<script>
import {addGroup, delGroup, getGroupList, updateGroup, updateUser} from '@/api/user'
export default {
  name: 'groupListMod',
  props: [],
  data () {
    return {
      editTitle: '新增分组',
      visible: false,
      editVisible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      columns:[
        {
          title: '分组名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        },
      ],
      tableData: [],
      form: {
        id: null,
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入组名', trigger: 'blur'}]
      }
    }
  },
  created() {
    const t = this
  },
  methods:{
    openDialog(){
      const t = this
      t.getGroupList()
      t.visible = true
    },

    async getGroupList(){
      let res = await getGroupList()
      if(res.data.code == 100){
        this.tableData = res.data.data
      } else {
        this.$message.warning(res.data.msg);
      }
    },

    editData(type,data){
      const t = this
      if(type == 'add'){
        t.editTitle = '新增分组'
        t.form = {
          id: null,
          name: '',
        }
      }else{
        t.editTitle = '编辑分组'
        for(let i in data){
          if(t.isValidKey(i,t.form)){
            t.form[i] = data[i]
          }
        }
      }
      t.editVisible = true
    },

    isValidKey(key, object){
      return key in object;
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.editTitle == '新增分组'){
            const { id,...data } = this.form
            addGroup(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('新增分组成功')
                this.getGroupList()
                this.editVisible = false
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            updateGroup(this.form).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('修改分组成功')
                this.getGroupList()
                this.editVisible = false
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    async delData(row){
      const t = this
      this.$confirm({
        title: '提示',
        content: h => <div>是否删除该条分组？</div>,
        cancelText: '取消',
        okText: '确认',
        centered: true,
        onOk() {
          delGroup({id: row.id}).then(res=>{
            if(res.data.code == 100){
              t.$message.success('删除分组成功');
              t.getGroupList()
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

    clearMod(){
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },

    refreshGroup(){
      this.$emit('refresh')
    },

    handleOk(e) {
      const t = this
      t.visible = false;
    },

    handleCancel(e) {
      const t = this
      t.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.delBtn{
  color: @danger
}
</style>
