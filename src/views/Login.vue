<template>
	<div class='bd'>
	<div class="hedaer">
	  <h2>新疆维吾尔自治区自然灾害综合监测预警中心</h2>
	  <h1>自然灾害综合风险预警发布及响应联动系统</h1>
	</div>
  <div class="login">

    <a-form-model
      layout="horizontal"
      :model="form"
      ref="ruleForm"
      :rules="rules"
      class="login-form"
    >
      <a-form-model-item ref="name" prop="name">
        <a-input
            placeholder="请输入用户名"
            size="large"
            v-model="form.name"
            autocomplete="new-password"
        >
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item ref="pwd" prop="pwd">
        <a-input-password
            type="password"
            placeholder="请输入密码"
            size="large"
            v-model="form.pwd"
            autocomplete="new-password"
        >
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input-password>
      </a-form-model-item>
<!--      <a-tabs default-active-key="1" @change="callback">-->
<!--        <a-tab-pane key="1" tab="用户名登录">-->
<!--          <a-form-item>-->
<!--            <a-input-->
<!--              placeholder="请输入用户"-->
<!--              size="large"-->
<!--              v-model="form.name"-->
<!--            >-->
<!--              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />-->
<!--            </a-input>-->
<!--          </a-form-item>-->
<!--          <a-form-item>-->
<!--            <a-input-password-->
<!--              type="password"-->
<!--              placeholder="请输入密码"-->
<!--              size="large"-->
<!--              v-model="form.pwd"-->
<!--            >-->
<!--              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />-->
<!--            </a-input-password>-->
<!--          </a-form-item>-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="2" tab="验证码登录" force-render>-->
<!--          <a-form-item>-->
<!--            <a-input-->
<!--              placeholder="手机号"-->
<!--              size="large"-->
<!--            >-->
<!--              <a-icon slot="prefix" type="mobile" style="color:rgba(0,0,0,.25)" />-->
<!--            </a-input>-->
<!--          </a-form-item>-->
<!--          <a-form-item>-->
<!--            <a-row :gutter="8">-->
<!--              <a-col :span="17">-->
<!--                <a-input placeholder="验证码">-->
<!--                  <a-icon slot="prefix" type="mobile" style="color:rgba(0,0,0,.25)" />-->
<!--                </a-input>-->
<!--              </a-col>-->
<!--              <a-col :span="7">-->
<!--                <a-button style="width: 100%">获取验证码</a-button>-->
<!--              </a-col>-->
<!--            </a-row>-->
<!--          </a-form-item>-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->
      <div style="margin-bottom: 20px">
        <a-checkbox :checked="saveAccount" style="color:#fff;" @change="isSave">记住密码</a-checkbox>
<!--        <a style="float: right">忘记密码</a>-->
      </div>
      <a-form-item style="text-align: center">
        <a-button
          type="primary"
          html-type="submit"
          style="width: 100%"
          size="large"
          @click="handleSubmit"
          :loading="isLoading"
        >
          登录
        </a-button>
      </a-form-item>
	  <center><p>技术支持：中国科学院</p></center>
    </a-form-model>
  </div>
  </div>
</template>

<script>

import { login, getMenuAdmin } from "@/api/login";
import Cookies from 'js-cookie';
import {Base64} from "js-base64";

export default {
  name: "login",
  data() {
    return {
      isLoading: false,
      saveAccount: false,
      // hasErrors,
      // form: this.$form.createForm(this),
      form: {
        name: '',
        pwd: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
      },
      menu: []
    };
  },
  created() {
    // this.$nextTick(() => {
    //   this.form.validateFields();
    // });
    this.hasUserCodeOrPassword()
  },
  methods: {
    hasUserCodeOrPassword(){
      if (localStorage.getItem('userName') && localStorage.getItem('userPassword')) {
        this.form.name = localStorage.getItem('userName')
        this.form.pwd = Base64.decode(localStorage.getItem('userPassword'))//解密
        this.saveAccount = true
      }
    },

    isSave(e){
      const t = this
      t.saveAccount = !t.saveAccount
    },

    handleSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.isLoading = true
          const res = await login(this.form)
          if (res.data.code === 100) {
            Cookies.set('resTk', res.data.data.tk);
            Cookies.set('resUid', res.data.data.uid);
            Cookies.set('userInfo',JSON.stringify(res.data.data),{expires: 7})
            if (this.saveAccount) {
              localStorage.setItem('userName', this.form.name)
              localStorage.setItem('userPassword', Base64.encode(this.form.pwd))
            } else {
              localStorage.removeItem('userName')
              localStorage.removeItem('userPassword')
            }
            this.$router.push('/home')
          } else {
            this.$message.warning(res.data.msg);
          }
          this.isLoading = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
	p{
		color:#fff;
		margin-top: 55px;
	}
h2{
	font-size: 30px;
}
.bd {
	width: 100%;
	height: 100vh;
	background: url('../assets/img/bg.jpeg') no-repeat;
	background-size: 100% 100%;
	background-attachment: fixed;/* 不设置的话页面滑动时，背景会不铺满*/
}


/deep/ .ant-tabs-bar {
  border-bottom: 0px;
  text-align: center;
}
  .hedaer {
    margin: 0px auto;
	padding-top:200px;
    width: 1000px;
    text-align: center;
	text-shadow:0 0 1px #000;
	h2{font-size: 36px;color:#fff;}
	h1{font-size: 48px;color:#fff;}
	}
.login {
  
  .login-form {
    width: 400px;
    margin: 60px auto 0px;	
	
  }
}
.ant-tabs{
	color:#fff;
	}
</style>
