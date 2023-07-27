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
      <a-form-model-item label="所属灾种" prop="disasterType">
        <a-select v-model="form.disasterType" placeholder="选择灾种">
          <a-select-option v-for="item in riskOptions" :value="item.value" :key="item.value">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="响应措施" prop="measure">
        <a-textarea v-model="form.measure" :auto-size="{ minRows: 3, maxRows: 6 }"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import {addMeasure,updateMeasure} from "@/api/new";
export default {
  name: 'reactionMod',
  props: [],
  data () {
    return {
      title: '新增响应措施',
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        id: null,
        disasterType: null,
        measure: ''
      },
      rules: {
        disasterType: [{ required: true, message: '请选择所属灾种', trigger: 'blur'}],
        measure: [{ required: true, message: '请输入响应措施', trigger: 'blur'}]
      },
      riskOptions: [
        {
          name: '地震',
          value: 1
        },
        {
          name: '洪涝',
          value: 2
        },
        {
          name: '气象',
          value: 3
        },
        {
          name: '泥石流',
          value: 4
        },
        {
          name: '水旱',
          value: 5
        },
        {
          name: '森林草原火灾',
          value: 6
        }
      ],
    }
  },
  created() {
    const t = this
  },
  methods:{
    openDialog(type,data){
      const t = this
      if(type == 'add'){
        t.title = '新增响应措施'
        t.form = {
          id: null,
          disasterType: null,
          measure: ''
        }
      }else{
        t.title = '编辑响应措施'
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
          if(this.title == '新增响应措施'){
            const { id,...data } = this.form
            addMeasure(data).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('新增响应措施成功')
                this.$emit('refresh')
                this.visible = false
              }else{
                this.$message.error(res.data.msg)
              }
            })
          }else{
            updateMeasure(this.form).then((res)=>{
              if(res.data.code == 100){
                this.$message.success('修改响应措施成功')
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
