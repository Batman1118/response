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
      <a-form-model-item label="姓名或称呼" prop="recipientName">
        <a-input v-model="form.recipientName"/>
      </a-form-model-item>
      <a-form-model-item label="单位名称（备注）" prop="company">
        <a-input v-model="form.company"/>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model="form.phone"/>
      </a-form-model-item>
      <a-form-model-item label="单位层级">
        <a-select v-model="form.unittype" placeholder="单位层级" disabled>
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
      <a-form-model-item label="所属地区" prop="districtId">
        <a-tree-select
            v-model="form.districtId"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="areaData"
            placeholder="行政区划"
            :replaceFields="replaceFields"
            @change="changeArea"
            disabled
        >
        </a-tree-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import {addRecipient, addUser, updateRecipient, updateUser} from "@/api/user";

export default {
  name: 'userMod',
  props: [],
  data () {
    return {
      title: '新增用户',
      visible: false,
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
      unitName: '',
      form: {
        id: null,
        recipientName: '',
        company: '',
        phone: '',
        unittype: null,
        districtId: null
      },
      rules: {
        recipientName: [{ required: true, message: '请输入姓名或称呼', trigger: 'blur'}],
        company: [{ required: true, message: '请输入单位名称（备注）', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur'}]
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
          recipientName: '',
          company: '',
          phone: '',
          unittype: null,
          districtId: null
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
            addRecipient(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('新增平级接收人成功')
                this.$emit('refresh')
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            const data = this.form
            updateRecipient(data).then((res)=>{
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
          return false;
        }
      });
    },

    changeArea(value, label, extra){
      const t = this
      t.form.districtId = value
      const code = t.findCodeById(t.areaData,value).code
      if(code.length == 2){
        t.form.company = '自治区自然灾害综合监测预警中心'
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

    handleCancel(e) {
      const t = this
      t.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
