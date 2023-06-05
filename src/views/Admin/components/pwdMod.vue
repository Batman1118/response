<template>
  <a-modal
      title="重置密码"
      :visible="visible"
      :confirm-loading="confirmLoading"
      width="50%"
      cancelText="取消"
      okText="确认"
      @ok="onSubmit"
      @cancel="handleCancel"
      :afterClose="clearMod"
  >
    <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
      <a-form-model-item label="请输入新密码" prop="newPwd">
        <a-input v-model="form.newPwd"/>
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="checkPwd">
        <a-input v-model="form.checkPwd"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {verifyPasswordPowerful, verifyPhone, verifyTelPhone} from "@/util/validate";

export default {
  name: 'pwdMod',
  data () {
    let validatePwd = (rule, value, callback)=>{
      if(value === ''){
        callback(new Error('请输入密码'))
      }else{
        if(!verifyPasswordPowerful(value)){
          callback(new Error('密码须包含字母、数字、特殊字符(不包括下划线)，长度在6-16之间'))
        }else{
          callback()
        }
      }
    }
    let validatePwd2 = (rule, value, callback)=>{
      if(value === ''){
        callback(new Error('请再次输入密码'))
      }else if(value !== this.form.newPwd){
        callback(new Error('两次输入密码不同'))
      }else{
        callback()
      }
    }
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        id: null,
        newPwd: '',
        checkPwd: ''
      },
      rules: {
        newPwd: [{ required: true, validator: validatePwd, trigger: 'blur'}],
        checkPwd: [{ required: true, validator: validatePwd2, trigger: 'blur'}]
      }
    }
  },
  created() {
    const t = this
  },
  methods:{
    clearMod(){
      this.$refs.ruleForm.clearValidate()
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
          this.visible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    handleOk(e) {
      const t = this
      t.confirmLoading = true;
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
