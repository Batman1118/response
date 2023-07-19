<template>
  <a-modal
      :title="title"
      :visible="visible"
      centered
      :confirm-loading="confirmLoading"
      width="50%"
      cancelText="取消"
      okText="确认"
      @ok="onSubmit"
      @cancel="handleCancel"
      :afterClose="clearMod"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
      <a-form-model-item label="姓名" prop="name">
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model="form.phone"/>
      </a-form-model-item>
      <a-form-model-item label="单位名称" prop="company">
        <a-input v-model="form.company"/>
      </a-form-model-item>
      <a-form-model-item label="分组" prop="addressBookGroupId">
        <a-select v-model="form.addressBookGroupId" placeholder="选择分组">
          <a-select-option v-for="item in groupList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {addGroupUser, addUser, updateGroupUser, updateUser} from '@/api/user'
import {verifySimplePhone} from "@/util/validate";
export default {
  name: 'addressUserMod',
  props: ['groupList'],
  data () {
    let validatePhone = (rule, value, callback)=>{
      if(value === ''){
        callback(new Error('请输入手机号'))
      }else{
        if(!verifySimplePhone(value)){
          callback(new Error('手机号格式有误'))
        }else{
          callback()
        }
      }
    }

    return {
      title: '新增用户',
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        id: null,
        name: '',
        phone: '',
        company: '',
        addressBookGroupId: null
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur'}],
        company: [{ required: true, message: '请输入单位名称', trigger: 'blur'}],
        addressBookGroupId: [{ required: true, message: '请选择分组', trigger: 'change'}],
      }
    }
  },
  created() {
    const t = this
  },
  methods:{
    openDialog(type,data){
      const t = this
      if(type == 'add'){
        t.title = '新增用户'
        t.form = {
          id: null,
          name: '',
          phone: '',
          company: '',
          addressBookGroupId: null
        }
      }else{
        t.title = '编辑用户'
        for(let i in data){
          if(t.isValidKey(i,t.form)){
            t.form[i] = data[i]
          }
        }
      }
      t.visible = true
    },
    isValidKey(key, object){
      return key in object;
    },

    clearMod(){
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.title == '新增用户'){
            const { id,...data } = this.form
            addGroupUser(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('新增用户成功')
                this.$emit('refresh')
                this.visible = false
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            updateGroupUser(this.form).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('修改用户成功')
                this.$emit('refresh')
                this.visible = false
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

    handleCancel(e) {
      const t = this
      t.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
