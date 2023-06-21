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
      <a-form-model-item label="单位层级" prop="unittype">
        <a-select v-model="form.unittype" placeholder="单位层级" @change="changeLevel">
          <a-select-option :disabled="unittype !== 1&&unittype !== null"  :value="1">
            省级
          </a-select-option>
          <a-select-option :disabled="unittype !== 1&&unittype !== null && unittype !== 2" :value="2">
            地（市、州）级
          </a-select-option>
          <a-select-option :disabled="unittype == 4 ? true : false" :value="3">
            区县级
          </a-select-option>
          <a-select-option :value="4">
            村（乡、镇）级
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="所属地区" prop="districtId">
        <!--        <a-cascader v-model="form.area" :options="areaData" expandTrigger="hover" changeOnSelect placeholder="请选择" @change="onChange"/>-->
        <a-tree-select
            v-model="form.districtId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="areaData"
            placeholder="行政区划"
            :replaceFields="replaceFields"
            @change="changeArea"
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="所属单位">
        <a-input v-model="form.company" readOnly/>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="roleId">
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
import {addUser, updateUser} from '@/api/user'
import {verifyPasswordPowerful, verifyPhone, verifySimplePhone} from "@/util/validate";
export default {
  name: 'userMod',
  props: ['unitType'],
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
    let validatePwd2 = (rule, value, callback)=>{
      if(value === ''){
        callback(new Error('请再次输入密码'))
      }else if(value !== this.form.pwd){
        callback(new Error('两次输入密码不同'))
      }else{
        callback()
      }
    }
    return {
      title: '新增用户',
      visible: false,
      unittype: this.unitType,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      areaData: [],
      replaceFields: {
        children:'children',
        title:'name',
        key:'id',
        value: 'id'
      },
      form: {
        id: null,
        realName: '',
        phone: '',
        name: '',
        pwd: '',
        dupPwd: '',
        sex: null,
        unittype: null,
        districtId: null,
        roleId: null,
        company: ''
      },
      rules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur'}],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur'}],
        pwd: [{ required: true, message: '请输入密码', trigger: 'blur'}],
        dupPwd: [{ required: true, validator: validatePwd2, trigger: 'blur'}],
        sex: [{ required: true, message: '请选择性别', trigger: 'change'}],
        unittype: [{ required: true, message: '请选择单位层级', trigger: 'change'}],
        districtId: [{ required: true, message: '请选择行政区划', trigger: 'change'}],
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
          id: null,
          realName: '',
          phone: '',
          name: '',
          pwd: '',
          dupPwd: '',
          sex: null,
          unittype: null,
          districtId: null,
          roleId: null,
          company: ''
        }
      }else{
        t.title = '编辑用户'
        data.roleId = data.role.roleId
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


    // 根据id查对象
    findNodeById(data,value) {
      for (const node of data) {
        if (node.id === value) {
          return node;
        }
        if (node.children) {
          const foundNode = this.findNodeById(node.children, value);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    // 根据code查对象
    findNodeByCode(data,code) {
      for (const node of data) {
        if (node.code === code) {
          return node;
        }
        if (node.children) {
          const foundNode = this.findNodeByCode(node.children,code);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    },

    changeLevel(value, option){
      console.log(value)
    },

    changeArea(value, label, extra){
      const t = this
      t.form.districtId = value
      const code = t.findNodeById(t.areaData,value).code
      if(code.length == 2){
        t.form.company = '自治区自然灾害预警中心'
        // t.form.province = t.findNodeByCode(t.areaData,code).name
        // t.form.city = ''
        // t.form.area = ''
        // t.form.town = ''
      } else if(code.length == 9){
        // t.form.province = t.findNodeByCode(t.areaData,code.substr(0,2)).name
        // t.form.city = t.findNodeByCode(t.areaData,code.substr(0,4)).name
        // t.form.area = t.findNodeByCode(t.areaData,code.substr(0,6)).name
        // t.form.town = t.findNodeByCode(t.areaData,code).name
        t.form.company = label[0]
      } else{
        // if(code.length == 4){
        //   t.form.city = t.findNodeByCode(t.areaData,code).name
        //   t.form.area = ''
        // }
        // if(code.length == 6){
        //   t.form.city = t.findNodeByCode(t.areaData,code.substr(0,4)).name
        //   t.form.area = t.findNodeByCode(t.areaData,code).name
        // }
        // t.form.province = t.findNodeByCode(t.areaData,code.substr(0,2)).name
        // t.form.town = ''
        t.form.company = label[0] + '自然灾害综合预警监测中心'
      }
    },

    clearMod(){
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.form.unittype !==  this.findNodeById(this.areaData,this.form.districtId).type){
            this.$message.error('单位层级和所属地区不匹配，请重新选择')
            return
          }
          if(this.title == '新增用户'){
            const { id,...data } = this.form
            addUser(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('新增用户成功')
                this.$emit('refresh')
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            const {pwd,dupPwd,...data} = this.form
            updateUser(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('修改用户成功')
                this.$emit('refresh')
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }
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
