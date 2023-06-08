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
      <a-form-model-item label="姓名" prop="realName">
        <a-input v-model="form.realName"/>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model="form.phone"/>
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="name">
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="密码" v-if="title== '新增用户'" prop="pwd">
        <a-input v-model="form.pwd"/>
      </a-form-model-item>
      <a-form-model-item label="重复密码" v-if="title== '新增用户'" prop="dupPwd">
        <a-input v-model="form.dupPwd"/>
      </a-form-model-item>
      <a-form-model-item label="性别" prop="sex">
        <a-radio-group v-model="form.sex" :default-value="1" button-style="solid">
          <a-radio-button :value="1">男</a-radio-button>
          <a-radio-button :value="0">女</a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="选择级别" prop="unittype">
        <a-select v-model="form.unittype" placeholder="监管级别">
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
        <a-select v-model="form.roleId" placeholder="角色">
          <a-select-option :value="2">
            领导
          </a-select-option>
          <a-select-option :value="3">
            工作人员
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
        realName: '',
        phone: '',
        name: '',
        pwd: '',
        dupPwd: '',
        sex: null,
        unittype: null,
        area: null,
        roleId: null
      },
      rules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur'}],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur'}],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur'}],
        dupPwd: [{ required: true, message: '请再次输入密码', trigger: 'blur'}],
        sex: [{ required: true, message: '请选择性别', trigger: 'change'}],
        unittype: [{ required: true, message: '请选择监管级别', trigger: 'change'}],
        area: [{ required: true, message: '请选择行政区划', trigger: 'change'}],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change'}]
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
          realName: '',
          phone: '',
          name: '',
          pwd: '',
          dupPwd: '',
          sex: undefined,
          unittype: undefined,
          area: undefined,
          roleId: null
        }
      }else{
        t.title = '编辑用户'
        data.roleId = data.role.roleId
        const { realName,phone,name,sex,unittype,roleId } = data
        t.form = { realName,phone,name,sex,unittype,roleId }
      }
      t.visible = true
    },

    clearMod(){
      this.$refs.ruleForm.clearValidate()
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.title == '新增用户')
             addUser(this.form).then((res)=>{
               if(res.data.code == 100){
                 console.log(res,'res')
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
