<template>
  <a-modal
      :title="title"
      :visible="visible"
      centered
      width="75%"
      @cancel="handleCancel"
      :afterClose="clearMod"
      :footer="null"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :wrapper-col="wrapperCol" class="form-cont">
      <div class="left">
        <a-form-model-item prop="title">
          <a-input v-model="form.title" placeholder="请输入标题" style="height: 50px; font-size: 20px;" :readOnly="disable"/>
        </a-form-model-item>
        <!--      <a-row>-->
        <!--        <a-col :span="12" style="display: flex;align-items: center">-->
        <!--          <span style="display: block;margin-bottom: 24px">相关灾种</span>-->

        <!--        </a-col>-->
        <!--        <a-col :span="12" style="display: flex;align-items: center;justify-content: right">-->
        <!--          <span style="display: block;margin-bottom: 24px">预警级别：</span>-->

        <!--        </a-col>-->
        <!--      </a-row>-->

        <a-row>
          <a-col :span="12">
            <a-form-model-item prop="emergType">
              <a-radio-group v-model="form.emergType" button-style="solid" :disabled="disable">
                <a-radio-button :value="2">
                  常规
                </a-radio-button>
                <a-radio-button :value="1">
                  紧临
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="display: flex;align-items: center;justify-content: right">
            <a-form-model-item prop="disasterType" style="margin-right: 12px">
              <a-select placeholder="请选择相关灾种" v-model="form.disasterType" style="min-width: 160px" allowClear @change="handleRisk" :disabled="disable">
                <a-select-option v-for="item in riskOptions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="warningLevel">
              <a-select placeholder="请选择预警级别" v-model="form.warningLevel" style="min-width: 160px" allowClear @change="handleLevel" :disabled="disable">
                <a-select-option v-for="item in levelOptions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item prop="content">
          <a-textarea v-model="form.content" placeholder="请输入短信通知内容部分" :auto-size="{ minRows: 3, maxRows: 5 }" :readOnly="disable"/>
        </a-form-model-item>
        <a-row v-if="userInfo.unittype == 1 || title == '信息转发' || title == '信息审核'||title == '信息详情'">
          <a-col :span="24" style="display: flex;align-items: center">
            <b style="margin-bottom: 24px">直览附件URL：</b>
            <a-form-model-item style="width: 50%">
              <a-textarea :readonly="title == '信息转发'||title == '信息审核'||title == '信息详情'?true:false" v-model="form.directViewUrl" placeholder="请输入url信息" :auto-size="{ minRows: 1, maxRows: 3 }"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-upload
                :disabled="disable"
                :action="uploadUrl"
                :file-list="fileList"
                @change="fileChange"
                :headers="header"
                accept=".doc, .docx, .word, .pdf, .zip, .xlsx, .rar, .jpg, .jpeg, .png"
                :data="{module: 'naturalDisasterPath'}"
                @download="downloadFile"
                :remove="(file)=>{removeFile(file)}"
                :showUploadList="{
                  showRemoveIcon: true,
                  showDownloadIcon: true
                }"
            >
              <a-button> <a-icon type="upload" />上传附件</a-button>
            </a-upload>
          </a-col>
          <a-col :span="12" style="display: flex;align-items: center;justify-content: right">
            <b style="margin-bottom: 24px">超时设置：</b>
            <a-form-model-item prop="timeout">
              <a-input v-model="form.timeout" style="width:200px;" placeholder="输入时间" suffix="分钟" :readOnly="disable"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <span><b>发布单位：</b>{{form.publishingUnit}}</span>
        <br/><br/>
        <!-- 子单位-->
        <a-row :gutter="24">
          <a-col :span="12">
            <div style="display:flex;justify-content: space-between;align-items: center;">
              <b>选择接收单位：</b>
              <a-checkbox :checked="checkAll" @change="checkChange" :disabled="disable">
                全选
              </a-checkbox>
            </div>
            <a-form-model-item prop="receiver" style="margin-bottom: 6px">
              <a-tree-select
                  :maxTagCount="3"
                  show-search
                  tree-checkable
                  treeCheckStrictly
                  style="width: 100%"
                  v-model="form.receiver"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="选择工作通知接收单位"
                  allow-clear
                  multiple
                  @change="depChanges"
                  @search="onSearch"
                  @select="onSelect"
                  :tree-data="areaUsers"
                  :replaceFields="replaceFields"
                  :disabled="disable"
              >
              </a-tree-select>
            </a-form-model-item>
<!--            <a-checkbox :checked="withLeaders" @change="isAddLeaders" style="margin-bottom: 24px" :disabled="disable">-->
<!--              同时发信息给本级领导-->
<!--            </a-checkbox>-->
          </a-col>
          <a-col :span="12">
            <div style="display:flex;justify-content: space-between;align-items: center;">
              <b>平级接收人选择：</b>
              <a-checkbox :checked="checkSlAll" @change="checkSlChange" :disabled="disable">
                全选
              </a-checkbox>
            </div>
            <a-form-model-item>
              <a-select mode="multiple" placeholder="选择平级接收单位" v-model="form.recipient" @change="handle" :disabled="disable" :maxTagCount="3">
                <a-select-option v-for="item in filteredOptions" :key="item.id" :value="item.id">
                  {{ item.recipientName }}({{item.company}} {{item.phone}})
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="display: flex;justify-content: right" v-if="title=='信息审核'">
          <a-col :span="20" style="display: flex;justify-content: right">
            <a-button type="primary" style="min-width: 140px;margin-right: 12px" @click="confirmSend(2)">
              审批通过
            </a-button>
            <a-button type="danger" style="min-width: 140px;" @click="confirmSend(3)">
              驳回
            </a-button>
          </a-col>
        </a-row>
        <a-row :gutter="24" style="display: flex;justify-content: right;align-items: center" v-if="title=='信息转发' || title=='信息修改'">
          <a-col :span="12" v-if="title=='信息转发'">
            <b style="margin-bottom: 6px">选择审批领导：</b>
            <a-form-model-item prop="reviewId">
              <a-select show-search v-model="form.reviewId" placeholder="请选择审批领导">
                <a-select-option v-for="(item,index) in leaders" :value="item.id" :key="index">{{item.realName}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="text-align: right" v-if="title=='信息转发'">
            <a-button type="primary" style="min-width: 140px;margin-right: 12px" @click="confirmSend(4)">
              确认转发
            </a-button>
          </a-col>
          <a-col :span="12" style="text-align: right" v-if="title=='信息修改'">
            <a-button type="primary" style="min-width: 140px;margin-right: 12px" @click="confirmSend(4)" :disabled="userInfo.role.id==1?true:false">
              确认并提交审核
            </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="right">
        <h2>短信预览</h2>
        <div class="mobile">
          <div class="mesg">
            <P>【自然灾害风险预警提示】{{form.content}}<br>发布单位：{{form.publishingUnit}}</P>
          </div>
        </div>
      </div>
    </a-form-model>
  </a-modal>
</template>

<script>
import {getAreaWithUserIfo, getPeerRecipient, getLeaders, delRecipient} from '@/api/user'
import {getUserInfo} from "@/util/storage";
import Cookies from "js-cookie";
import {massSend, msgSend, msgUpdate} from "@/api/send";
import {postReview} from "@/api/review";
import axios from "axios";
import {deleteFile} from "@/api/list";
export default {
  name: "msgEditMod",
  data() {
    return {
      title: '信息审核',
      disable: true,
      visible: false,
      confirmLoading: false,
      leaders: [],
      userInfo: {},
      wrapperCol: { span: 24 },
      filteredOptions:[],
      form: {
        id: null,
        title: '',
        emergType: null,
        disasterType: undefined,
        warningLevel: undefined,
        content: '',
        directViewUrl: '',
        publishingUnit: '',
        districtId: null,
        attachments: [],
        timeout: null,
        reviewId: null,
        receiver: [],
        recipient: [],
        acceptingUnitIds: [],
        peerRecipientIds: []
      },
      sendLeaders: [],
      checkAll: false,
      checkSlAll: false,
      withLeaders: false,
      areaUsers: [],
      replaceFields: {
        children:'children',
        title:'name',
        key:'id',
        value: 'id'
      },
      riskOptions: [
        {name: '地震',value: 1},
        {name: '气象',value: 3},
        {name: '地质灾害',value: 4},
        {name: '水旱',value: 5},
        {name: '森林草原火灾',value: 6}
      ],
      levelOptions: [
        {name: '红色预警',value: 1},
        {name: '橙色预警',value: 2},
        {name: '黄色预警',value: 3},
        {name: '蓝色预警',value: 4}
      ],
      rules: {
        emergType: [{ required: true, message: '请选择紧急类型', trigger: 'change'}],
        disasterType: [{ required: true, message: '请选择灾种', trigger: 'change'}],
        warningLevel: [{ required: true, message: '请选择预警级别', trigger: 'change'}],
        title: [{ required: true, message: '请输入信息标题', trigger: 'blur'}],
        content: [{ required: true, message: '请输入信息内容', trigger: 'blur'}],
        timeout: [{ required: true, message: '请输入超时时间', trigger: 'blur'}],
        receiver: [{ required: true, message: '请选择接收单位', trigger: 'change'}],
        reviewId: [{ required: true, message: '请选择审批人', trigger: 'change'}],
        // recipient: [{ required: true, message: '请选择平级接收人', trigger: 'change'}]
        // acceptingUnitIds: [{ required: true, message: '请选择接收单位', trigger: 'change'}],
        // peerRecipientIds: [{ required: true, message: '请选择平级接收人', trigger: 'change'}]
      },
      uploadUrl: '',
      fileList: [],
      header: {
        uid: null,
        tk: Cookies.get('resTk')
      },
      delList: []
    };
  },
  components: {},
  created() {
    const t = this
    const { baseUrl } = require('../../../../config/env.' + process.env.NODE_ENV)
    t.uploadUrl= baseUrl + '/attachment/upload/detail'
    t.userInfo = getUserInfo()
    t.header.uid = t.userInfo.uid
    t.form.districtId = t.userInfo.districtId
    t.form.publishingUnit = t.userInfo.company
    t.getSameLevel()
    t.getAreaUsers()
  },
  computed: {},
  methods: {
    openMod(type,data,id){
      const t = this
      t.getLeaders()
      t.form.acceptingUnitIds = []
      t.form.peerRecipientIds = []
      t.sendLeaders = []
      if(type == 'review' || type == 'view' || type == 'edit') {
        t.sendLeaders = data.acceptingUnitIds.filter(i=>i.roleId == 2)
        data.acceptingUnitIds = data.acceptingUnitIds.filter(i=>i.roleId == 3)
        if(t.sendLeaders.length>0){
          t.withLeaders = true
        }else{
          t.withLeaders = false
        }
        for(let i in data){
          if(t.isValidKey(i,t.form)){
            t.form[i] = data[i]
          }
        }
        if(data.attachments && data.attachments.length>0){
          t.fileList = data.attachments.map((i)=>{
            return {
              uid: i.id,
              name: i.attachementName,
              status: 'done',
              url: i.attachement
            }
          })
        }else{
          t.fileList = []
        }
        const arr = data.acceptingUnitIds.map((i)=>{return {
          value: i.districtId
        }})
        t.form.receiver = JSON.parse(JSON.stringify(arr)).filter(
            (item, index) => JSON.parse(JSON.stringify(arr)).findIndex(obj => obj.value === item.value) === index
        )
        t.form.recipient = data.peerRecipientIds.map(i=>i.recipienterId)
        if(type == 'review'){
          t.title = '信息审核'
          t.disable = false
        }else if(type == 'edit'){
          t.title = '信息修改'
          t.disable = false
        }else{
          t.title = '信息详情'
          t.disable = true
        }
      }else{
        t.form.title = data.title
        t.form.emergType = data.emergType
        t.form.disasterType = data.disasterType
        t.form.warningLevel = data.warningLevel
        t.form.content = data.content
        t.form.timeout = data.timeout
        t.form.forwardWarnInfoLogId = id
        t.form.forwardStatus = 1
        t.form.forwardPath = data.forwardPath
        t.form.directViewUrl = data.directViewUrl
        if(data.attachments && data.attachments.length>0){
          t.fileList = data.attachments.map((i)=>{
            return {
              uid: i.id,
              name: i.attachementName,
              status: 'done',
              url: i.attachement
            }
          })
        }else{
          t.fileList = []
        }
        t.title = '信息转发'
        t.disable = false
      }
      t.visible = true
    },
    isValidKey(key, object){
      return key in object;
    },

    // 获取同级接收人
    async getSameLevel(){
      let t = this
      let res = await getPeerRecipient()
      if(res.data.code == 100){
        if(res.data.data){
          t.filteredOptions = res.data.data
        }else{
          console.log('暂无数据')
        }
      }else{
        this.$message.warning(res.data.msg);
      }
    },

    // 获取接收单位
    async getAreaUsers(){
      let t = this
      let res = await getAreaWithUserIfo()
      if(res.data.code == 100){
        if(res.data.data){
          // const treeD = []
          t.userTitTree(res.data.data)
          // treeD.push(t.findNodeById(res.data.data,t.userInfo.districtId))
          t.areaUsers = t.findNodeById(res.data.data,t.userInfo.districtId).children
          t.unittype = t.findNodeById(res.data.data,t.userInfo.districtId)?.type
        }else{
          console.log('暂无数据')
        }
      }else{
        this.$message.warning(res.data.msg);
      }
    },

    // 获取领导
    async getLeaders(){
      let t = this
      let res = await getLeaders()
      if(res.data.code == 100){
        if(res.data.data){
          t.leaders = res.data.data
        }else{
          console.log('暂无数据')
        }
      }else{
        this.$message.warning(res.data.msg);
      }
    },

    //选择子部门部分
    depChanges(value,label,extra) {
      const t = this
      if(t.form.receiver.length == 0){
        t.checkAll = false
      }
    },
    checkChange(e) {
      const t = this
      this.checkAll = !this.checkAll
      if(t.checkAll == true){
        t.form.receiver = t.traverseTree(t.areaUsers)
      }else{
        t.form.receiver = []
      }
    },

    //选择平级部门部分
    handle(selectedItems) {
      const t = this
      if(t.form.recipient.length == t.filteredOptions.length){
        t.checkSlAll = true
      }else{
        t.checkSlAll = false
      }
    },

    checkSlChange(e) {
      const t = this
      t.checkSlAll = !t.checkSlAll
      if(t.checkSlAll == true){
        t.form.recipient = t.filteredOptions.map(i=>i.id)
      }else{
        t.form.recipient = []
      }
    },

    isAddLeaders(e) {
      const t = this
      t.withLeaders = !t.withLeaders
      if(e.target.checked){
        // if(t.userInfo.role.id == 3){
          t.sendLeaders = []
          for(let i of t.leaders){
            const {realName,...data} = i
            const { id: recipienterId, name: recipienterName, phone: recipienterPhone,...rest} = data
            const obj = { recipienterId, recipienterName, recipienterPhone, province: null,city: null,area: null,town: null,receiveUnit: t.userInfo.company,unittype: t.userInfo.unittype,roleId: 2,...rest}
            t.sendLeaders.push(obj)
          }
        // }
      }else{
        t.sendLeaders = []
      }
    },

    fileChange(info) {
      let fileList = [...info.fileList];
      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.uid === info.file.uid) {
          if (file.status == 'done') {
            if (file.response) {
              const res = file.response
              if (res.code == 100) {
                this.$message.success('文件上传成功')
              } else {
                this.$message.error('文件上传失败')
              }
              // Component will show file.url as link
              file.url = res.data.fileUrl
            }
          }
        }
        return file;
      });
      this.fileList = fileList;
      console.log(this.fileList,'list')
    },

    removeFile(file){
      if(this.title == '信息转发'){
        this.delList.push(file.uid)
      }else{
        this.delList.push(file.response.data.id)
      }
      console.log(this.fileList,this.form,'form')
    },

    async deleteFile(){
      const t = this
      for(let i of t.delList){
        const res = await deleteFile(i)
        if(res.data.code == 100){
          console.log('文件删除成功')
        }else{
          t.$message.error(res.data.msg)
        }
      }
    },

    confirmSend(status){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.acceptingUnitIds = []
          this.form.peerRecipientIds = []
          this.form.attachments = []
          const aList = this.form.receiver.map(item=>this.findNodeById(this.areaUsers,item.value)?.users)
          if(aList.includes(null)){
            this.$message.error('选择接收单位时存在无用户的单位')
            return
          }
          const newAList = [].concat(...aList)
          for(let i of newAList){
            // const {realName,...data} = i
            const {id:recipienterId,name: recipienterName,phone: recipienterPhone,company: receiveUnit,realName: recipienterRealName,...rest} = i
            const obj = { recipienterId, recipienterName, recipienterRealName, recipienterPhone, receiveUnit,...rest}
            this.form.acceptingUnitIds.push(obj)
          }
          this.form.acceptingUnitIds = [...this.form.acceptingUnitIds,...this.sendLeaders]
          if(this.form.recipient.length>0){
            const bList = this.form.recipient.map(item => this.filteredOptions.find(i=>i.id == item))
            for(let i of bList){
              const {id:recipienterId,recipientName: recipienterName,phone: recipienterPhone, company: receiveUnit,...rest} = i
              const obj = {recipienterId, recipienterName,recipienterPhone,receiveUnit,unittype:this.unittype,recipienterRealName:recipienterName,...rest}
              this.form.peerRecipientIds.push(obj)
            }
          }
          if(this.fileList.length == 0){
            this.form.attachments = []
          }else{
            this.form.attachments = this.fileList.map((i)=>{
              if(i.response){
                return i.response.data.id
              }else{
                return i.uid
              }
            })
          }
          if(status == 2 || status == 3){
            const {receiver,recipient,reviewId,...data} = this.form
            data.reviewStatus = status
            postReview(data).then( res =>{
              if(res.data.code == 100){
                this.$message.success('审核已提交')
                this.deleteFile()
              }else{
                this.$message.error(res.data.msg)
              }
              this.$refs.ruleForm.clearValidate()
              this.$refs.ruleForm.resetFields()
              this.delList = []
              this.fileList = []
              this.visible = false
              this.$emit('refresh')
            })
          }else{
            if(this.title == '信息转发'){
              const {receiver,recipient,id,...data} = this.form
              msgSend(data).then( res =>{
                if(res.data.code == 100){
                  this.$message.success('信息已提交审核')
                  this.deleteFile()
                }else{
                  this.$message.error(res.data.msg)
                }
                this.$refs.ruleForm.clearValidate()
                this.$refs.ruleForm.resetFields()
                this.delList = []
                this.fileList = []
                this.visible = false
                this.$emit('refresh')
              })
            }else{
              const {receiver,recipient,reviewId,...data} = this.form
              msgUpdate(data).then( res =>{
                if(res.data.code == 100){
                  this.$message.success('信息已提交审核')
                  this.deleteFile()
                }else{
                  this.$message.error(res.data.msg)
                }
                this.$refs.ruleForm.clearValidate()
                this.$refs.ruleForm.resetFields()
                this.delList = []
                this.fileList = []
                this.visible = false
                this.$emit('refresh')
              })
            }
          }
        }else{
          console.log('error submit!!');
          return false;
        }
      })
    },

    downloadFile(file){
      const t = this
      const { baseUrl } = require('../../../../config/env.' + process.env.NODE_ENV)
      axios.get(baseUrl + file.url,{headers:{'Content-Type': 'application/json','tk': `${Cookies.get('resTk')}`,'uid':`${Cookies.get('resUid')}`},responseType: 'blob'}).then(res=>{
        if (res) {
          const link = document.createElement('a')
          let blob = new Blob([res.data],{type: res.data.type})
          link.style.display = "none";
          link.href = URL.createObjectURL(blob); // 创建URL
          window.open(link.href)
          // link.setAttribute("download", file.name);
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
        } else {
          this.$message.error('获取文件失败')
        }
      })
    },

    handleCancel(e) {
      const t = this
      t.visible = false;
    },

    clearMod(){
      this.$refs.ruleForm.clearValidate()
      this.$refs.ruleForm.resetFields()
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

    // 将树状数据所有id和name放入对象数组
    traverseTree(treeData) {
      let result = [];
      function traverse(data) {
        for(const node of data){
          if(node.users && node.users.length>0) {
            result.push({label: node.name, value: node.id});
            if (node.children && node.children.length > 0) {
              traverse(node.children);
            }
          }
        }
      }
      traverse(treeData);
      return result;
    },

    // 将树状数据name字段放入users的姓名电话
    userTitTree(treeData) {
      for(const node of treeData){
        if(node.users){
          node.users = node.users.filter(i=>i.roleId == 3)
          node.users = node.users.map((i)=>{
            return{
              ...i,
              unittype: node.type,
              districtId: node.id
            }
          })
          node.name = node.name + '('+node.users.map(i=>i.realName +' '+ i.phone).join(',')+')'
        }
        if(node.children){
          this.userTitTree(node.children)
        }
      }
      return treeData
    },

    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log(...arguments);
    },
    handleRisk(selectedItems) {
      // this.selectedItems = selectedItems;
    },
    handleLevel(selectedItems) {
      // this.selectedItems = selectedItems;
    },

    onChange(){
      console.log(this.value)
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
}
</script>

<style lang="less" scoped>
.form-cont{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .left {
    width: 58%;
  }

  .right {
    width: 39%;
    border-left: 1px silver solid;
    padding-left: 18px;

    .mobile {
      position: relative;
      background: black;
      border: 1px solid black;
      width: 280px;
      min-height: 500px;
      border-radius: 25px;
      margin-left: 20px;

      .mesg {
        width: 260px;
        margin: 25px auto;
        min-height: 450px;
        background: white;
        padding-top: 10px;

        p {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 10px;
          font-size: 16px;
          margin: 15px 10px;
        }
      }
    }
  }
}

.ant-radio-button-wrapper-checked {
  /* 自定义禁用样式 */
  /* 例如，修改文本颜色和背景颜色 */
  color: #fff;
  background-color: #1890ff;
}

/deep/.ant-select-disabled{
  color: @blackText;

  .ant-select-selection{
    background: #fff;

    .ant-select-selection__choice{
      color: @blackText;
      background: #fafafa;
    }
  }
}
</style>
