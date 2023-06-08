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
      <a-form-model-item label="姓名或称呼" prop="name">
        <a-input v-model="form.name"/>
      </a-form-model-item>
      <a-form-model-item label="单位名称（备注）" prop="depName">
        <a-input v-model="form.depName"/>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="phone">
        <a-input v-model="form.phone"/>
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
        <a-tree-select
            v-model="form.area"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="areaData"
            placeholder="行政区划"
        >
        </a-tree-select>
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
        depName: '',
        phone: '',
        level: null,
        area: null
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur'}],
        depName: [{ required: true, message: '请输入单位名称', trigger: 'blur'}],
        level: [{ required: true, message: '请选择监管级别', trigger: 'change'}],
        area: [{ required: true, message: '请选择行政区划', trigger: 'change'}]
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
          depName: '',
          phone: '',
          level: null,
          area: null
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
