<template>
	<div class="inner">
    <a-alert
        message="管理员身份无法进行信息编辑操作"
        banner
        closable
        v-if="userInfo.role.id === 1"
        type="error"
        style="margin-bottom: 12px"
    />
    <h2>预警信息发布</h2>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :wrapper-col="wrapperCol">
      <div class="left">
        <a-form-model-item prop="title">
          <a-input v-model="form.title" placeholder="请输入标题" style="height: 50px; font-size: 20px;" />
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
              <a-radio-group v-model="form.emergType" button-style="solid">
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
            <a-form-model-item prop="disasterType" style="margin-right: 20px">
              <a-select placeholder="请选择相关灾种" v-model="form.disasterType" style="width: 240px" allowClear @change="handleRisk">
                <a-select-option v-for="item in riskOptions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item prop="warningLevel">
              <a-select placeholder="请选择预警级别" v-model="form.warningLevel" style="width: 240px" allowClear @change="handleLevel">
                <a-select-option v-for="item in levelOptions" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item prop="content">
          <a-textarea v-model="form.content" placeholder="请输入短信通知内容部分" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-upload
                :action="uploadUrl"
                :file-list="fileList"
                @change="fileChange"
                :headers="header"
                accept=".doc, .docx, .word, .pdf, .zip, .xlsx, .rar"
                :data="{module: 'naturalDisasterPath'}"
                :remove="(file)=>{removeFile(file)}"
            >
              <a-button> <a-icon type="upload" />上传附件</a-button>
            </a-upload>
          </a-col>
          <a-col :span="12" style="display: flex;align-items: center;justify-content: right">
            <b style="margin-bottom: 24px">超时设置：</b>
            <a-form-model-item prop="timeout">
              <a-input v-model="form.timeout" style="width:200px;" placeholder="输入时间" suffix="分钟"/>
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
              <a-checkbox :checked="checkAll" @change="checkChange">
                全选
              </a-checkbox>
            </div>
            <a-form-model-item prop="receiver" style="margin-bottom: 12px">
              <a-tree-select
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
              >
              </a-tree-select>
            </a-form-model-item>
            <a-checkbox @change="isAddLeaders" style="margin-bottom: 24px">
              同时发信息给本级领导
            </a-checkbox>
          </a-col>
          <a-col :span="12">
            <b style="margin-bottom: 6px">平级接收人选择：</b>
            <a-form-model-item prop="recipient">
              <a-select mode="multiple" placeholder="选择平级接收单位" v-model="form.recipient" @change="handle">
                <a-select-option v-for="item in filteredOptions" :key="item.id" :value="item.id">
                  {{ item.recipientName }}({{item.company}} {{item.phone}})
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">

          </a-col>
        </a-row>
        <a-row :gutter="24" style="display: flex;align-items: center">
          <a-col :span="12">
            <b style="margin-bottom: 6px">选择审批领导：</b>
            <a-form-model-item prop="reviewId">
              <a-select show-search v-model="form.reviewId" placeholder="请选择审批领导" style="width: 300px">
                <a-select-option v-for="(item,index) in leaders" :value="item.id" :key="index">{{item.realName}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" style="text-align: right">
            <a-button type="primary" style="width: 250px;" @click="confirmSend()" :disabled="userInfo.role.id==1?true:false">
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
	</div>
</template>

<script>
import {getAreaWithUserIfo, getPeerRecipient, getLeaders} from '@/api/user'
  import {getUserInfo} from "@/util/storage";
  import Cookies from "js-cookie";
  import axios from "axios";
import {massSend, msgSend} from "@/api/send";
import {deleteFile} from "@/api/list";
	export default {
		name: "notice",
		data() {
			return {
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
        leaders: [],
        checkAll: false,
        areaUsers: [],
        replaceFields: {
          children:'children',
          title:'name',
          key:'id',
          value: 'id'
        },
        riskOptions: [
          {name: '地震',value: 1},
          {name: '洪涝',value: 2},
          {name: '气象',value: 3},
          {name: '泥石流',value: 4},
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
          recipient: [{ required: true, message: '请选择平级接收人', trigger: 'change'}]
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
      const { baseUrl } = require('../../../config/env.' + process.env.NODE_ENV)
      t.uploadUrl= baseUrl + '/attachment/upload/detail'
      t.userInfo = getUserInfo()
      t.header.uid = t.userInfo.uid
      t.form.districtId = t.userInfo.districtId
      t.form.publishingUnit = t.userInfo.company
      t.getSameLevel()
      t.getAreaUsers()
      t.getLeaders()
    },
    computed: {},
		methods: {
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
            // t.leaders = t.findNodeById(res.data.data,t.userInfo.districtId).users.filter(i=>i.roleId == 2)
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
        t.checkAll = !t.checkAll
        if(t.checkAll == true){
          t.form.receiver = t.traverseTree(t.areaUsers)
        }else{
          t.form.receiver = []
        }
      },

      isAddLeaders(e) {
        const t = this
        console.log(`checked = ${e.target.checked}`);
      },

      fileChange(info) {
        let fileList = [...info.fileList];
        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if(file.status == 'done'){
            if (file.response) {
              const res = file.response
              if(res.code == 100){
                this.$message.success('文件上传成功')
              }else{
                this.$message.error('文件上传失败')
              }
              // Component will show file.url as link
              file.url = res.data.fileUrl
            }
          }
          return file;
        });
        this.fileList = fileList;
      },

      removeFile(file){
        this.delList.push(file.uid)
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

      confirmSend(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.form.acceptingUnitIds = []
            this.form.peerRecipientIds = []

            const aList = this.form.receiver.map(item=>this.findNodeById(this.areaUsers,item.value)?.users)
            if(aList.includes(null)){
              this.$message.error('选择接收单位时存在无用户的单位')
              return
            }
            const newAList = [].concat(...aList)
            for(let i of newAList){
              const {realName,...data} = i
              const {id:recipienterId,name: recipienterName,phone: recipienterPhone,company: receiveUnit,...rest} = data
              const obj = { recipienterId, recipienterName, recipienterPhone, receiveUnit,...rest}
              this.form.acceptingUnitIds.push(obj)
            }

            if(this.form.recipient.length>0){
              const bList = this.form.recipient.map(item => this.filteredOptions.find(i=>i.id == item))
              for(let i of bList){
                const {id:recipienterId,recipientName: recipienterName,phone: recipienterPhone, company: receiveUnit,...rest} = i
                const obj = {recipienterId, recipienterName,recipienterPhone,receiveUnit,unittype:this.unittype,...rest}
                this.form.peerRecipientIds.push(obj)
              }
            }
            this.form.attachments = this.fileList.map(i=>i.response.data.id)
            const {receiver,recipient,id,...data} = this.form
            msgSend(data).then( res =>{
              if(res.data.code == 100){
                this.deleteFile()
                this.$message.success('信息已提交审核')
              }else{
                this.$message.error(res.data.msg)
              }
              this.fileList = []
              this.delList = []
              this.$refs.ruleForm.clearValidate()
              this.$refs.ruleForm.resetFields()
            })
          }else{
            console.log('error submit!!');
            return false;
          }
        })
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
      // 将users为null的节点删除
      // removeNodesWithoutUsers(node) {
      //     if (node.users === null && node.children === null) {
      //       return null; // 返回 null 表示删除节点
      //     }
      //     if (node.children && node.children.length > 0) {
      //       node.children = node.children.map(child => this.removeNodesWithoutUsers(child)).filter(Boolean);
      //     }
      //     return node;
      // },

      onSearch() {
        console.log(...arguments);
      },
      onSelect() {
        console.log(...arguments);
      },
			//选择平级部门部分
			handle(selectedItems) {
				this.selectedItems = selectedItems;
			},
      handleRisk(selectedItems) {
        // this.selectedItems = selectedItems;
      },
      handleLevel(selectedItems) {
        // this.selectedItems = selectedItems;
      },
		},
	}
</script>

<style lang="less" scoped>
	.left {
		width: 58%;
		float: left;
	}

	.right {
		width: 39%;
		float: right;
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
</style>