<template>
  <a-modal
      :title="title"
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
      <a-form-model-item label="姓名" prop="name">
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model="form.phone"/>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="form.userName"/>
      </a-form-model-item>
      <a-form-model-item label="密码" v-if="title== '新增用户'" prop="password">
        <a-input v-model="form.password"/>
      </a-form-model-item>
      <a-form-model-item label="重复密码" v-if="title== '新增用户'" prop="rePassword">
        <a-input v-model="form.rePassword"/>
      </a-form-model-item>
      <a-form-model-item label="性别" prop="sex">
        <a-radio-group v-model="form.sex" :default-value="0" button-style="solid">
          <a-radio-button :value="0">男</a-radio-button>
          <a-radio-button :value="1">女</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="选择级别" prop="level">
        <a-select v-model="form.level" placeholder="监管级别">
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
      </a-form-model-item>
      <a-form-model-item label="所属地区" prop="area">
<!--        <a-cascader v-model="form.area" :options="areaData" expandTrigger="hover" changeOnSelect placeholder="请选择" @change="onChange"/>-->
        <a-tree-select
            v-model="form.area"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="areaData"
            placeholder="行政区划"
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="所属单位">
        <a-input v-model="unitName"/>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="role">
        <a-select v-model="form.role" placeholder="角色">
          <a-select-option :value="1">
            领导
          </a-select-option>
          <a-select-option :value="2">
            公司人员
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addUser } from '@/api/user'
export default {
  name: 'userMod',
  data () {
    return {
      title: '新增用户',
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      areaData: [],
      unitName: '',
      form: {
        name: '',
        phone: '',
        userName: '',
        password: '',
        rePassword: '',
        sex: null,
        level: null,
        area: null,
        role: null
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur'}],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{ required: true, message: '请输入密码', trigger: 'blur'}],
        rePassword: [{ required: true, message: '请再次输入密码', trigger: 'blur'}],
        sex: [{ required: true, message: '请选择性别', trigger: 'change'}],
        level: [{ required: true, message: '请选择监管级别', trigger: 'change'}],
        area: [{ required: true, message: '请选择行政区划', trigger: 'change'}],
        role: [{ required: true, message: '请选择角色', trigger: 'change'}]
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
          name: '',
          phone: '',
          userName: '',
          password: '',
          rePassword: '',
          sex: undefined,
          level: undefined,
          area: undefined,
          role: undefined
        }
      }else{
        t.title = '编辑用户'
        t.form = data
      }
      t.visible = true
    },

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
