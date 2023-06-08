<template>
  <a-modal
      title="重置密码"
      centered
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
      <a-form-model-item label="原密码" prop="oldPwd">
<!--        <a-input v-model="form.oldPwd"/>-->
        <a-input-password v-model="form.oldPwd" placeholder="请输入原密码" />
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPwd">
<!--        <a-input v-model="form.newPwd"/>-->
        <a-input-password v-model="form.newPwd" placeholder="请输入新密码" />
      </a-form-model-item>
      <a-form-model-item label="重复新密码" prop="reNewPwd">
        <a-input-password v-model="form.reNewPwd" placeholder="请再次输入新密码" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {verifyPasswordPowerful, verifyPhone, verifyTelPhone} from "@/util/validate";
import { updatePwd } from '@/api/user'
import {loginOut} from "@/api/login";
import {Session} from "@/util/storage";
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
      updateType: 0,
      form: {
        uid: null,
        oldPwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      rules: {
        // oldPwd: [{ required: true, validator: validatePwd, trigger: 'blur'}],
        // newPwd: [{ required: true, validator: validatePwd, trigger: 'blur'}],
        // reNewPwd: [{ required: true, validator: validatePwd2, trigger: 'blur'}]
        oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur'}],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur'}],
        reNewPwd: [{ required: true, validator: validatePwd2, trigger: 'blur'}]
      }
    }
  },
  created() {
    const t = this
  },
  methods:{
    clearMod(){
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let {reNewPwd, ...data} = this.form
          updatePwd(data).then(res=>{
            if(res.data.code == 100){
              if(this.updateType == 1){
                this.$message.success('密码修改成功，需重新登录');
                loginOut().then(res=>{
                  if (res.data.code === 100) {
                    Session.clear(); // 清除缓存/token等
                    // 使用 reload 时，不需要调用 resetRoute() 重置路由
                    this.$router.push('/')
                    // window.location.reload();
                  } else {
                    this.$message.warning(res.data.msg);
                  }
                })
              }else{
                this.$message.success('密码修改成功');
                this.$emit('refresh')
              }
              this.visible = false
            }else{
              this.$message.warning(res.data.msg);
            }
          })
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
