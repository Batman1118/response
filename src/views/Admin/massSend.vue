<template>
	<div class="inner">
    <a-alert
        message="管理员身份无法进行短信群发操作"
        banner
        closable
        v-if="userInfo.role.id === 1"
        type="error"
        style="margin-bottom: 12px"
    />
		<h2>预警信息发布</h2>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :wrapper-col="wrapperCol">
		<div class="left">
<!--      <a-form-model-item prop="title">-->
<!--			  <a-input v-model="form.title" placeholder="请输入标题" style="height: 50px; font-size: 20px;" />-->
<!--      </a-form-model-item>-->
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
<!--      <a-row>-->
<!--        <a-col :span="12">-->
<!--          <a-button>上传附件</a-button>-->
<!--        </a-col>-->
<!--        <a-col :span="12" style="display: flex;align-items: center;justify-content: right">-->
<!--          <b style="margin-bottom: 24px">超时设置：</b>-->
<!--          <a-form-model-item prop="overTime">-->
<!--            <a-input v-model="form.overTime" style="width:200px;" placeholder="输入时间" suffix="分钟"/>-->
<!--          </a-form-model-item>-->
<!--        </a-col>-->
<!--      </a-row>-->
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
          <a-form-model-item prop="receiver">
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
                @change="onChanges"
                @search="onSearch"
                @select="onSelect"
                :tree-data="areaUsers"
                :replaceFields="replaceFields"
              >
            </a-tree-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <div style="display:flex;justify-content: space-between;align-items: center;">
            <b>平级接收人选择：</b>
            <a-checkbox :checked="checkSlAll" @change="checkSlChange">
              全选
            </a-checkbox>
          </div>
          <a-form-model-item>
            <a-select mode="multiple" placeholder="选择平级接收单位" v-model="form.recipient" @change="handle">
              <a-select-option v-for="item in filteredOptions" :key="item.id" :value="item.id">
                {{ item.recipientName }}({{item.company}} {{item.phone}})
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
<!--			<div>-->
<!--        <b>选择审批领导：</b> -->
<!--        <a-select show-search placeholder="请选择审批领导"-->
<!--					option-filter-prop="children" style="width: 300px" :filter-option="filterOption"-->
<!--					@focus="handleFocus" @blur="handleBlur" @change="handleChange">-->
<!--					<a-select-option value="jack">-->
<!--						裴小威-->
<!--					</a-select-option>-->
<!--					<a-select-option value="lucy">-->
<!--						赵东升-->
<!--					</a-select-option>-->
<!--					<a-select-option value="tom">-->
<!--						王卫萍-->
<!--					</a-select-option>-->
<!--				</a-select>-->
<!--      </div>-->
      <div style="display: flex;justify-content: right">
        <a-button type="primary" style="width: 250px;" @click="confirmSend()" :disabled="userInfo.role.id==1?true:false">
          确认发送
        </a-button>
      </div>
		</div>

		<div class="right">
			<h2>短信预览</h2>
			<div class="mobile">
				<div class="mesg">
					<P>【自然灾害风险预警提示】{{form.content}}发布单位：{{form.publishingUnit}}</P>
				</div>

			</div>
		</div>
    </a-form-model>
	</div>
</template>

<script>
import { getPeerRecipient, getAreaWithUserIfo } from '@/api/user'
import { massSend } from "@/api/send";
import {getUserInfo} from "@/util/storage";
	export default {
		name: "massSend",
		data() {
			return {
        userInfo: getUserInfo(),
				department: '自治区自然灾害综合监测预警中心',
        filteredOptions:[],
        wrapperCol: { span: 24 },
        form: {
          id: null,
          emergType: null,
          disasterType: undefined,
          warningLevel: undefined,
          content: '',
          publishingUnit: '',
          receiver: [],
          recipient: [],
          verticalRecipient: [],
          horizontalRecipient: []
        },
        checkAll: false,
        checkSlAll: false,
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
          content: [{ required: true, message: '请输入信息内容', trigger: 'blur'}],
          receiver: [{ required: true, message: '请选择接收单位', trigger: 'change'}],
          // recipient: [{ required: true, message: '请选择平级接收人', trigger: 'change'}]
          // verticalRecipient: [{ required: true, message: '请选择接收单位', trigger: 'change'}],
          // horizontalRecipient: [{ required: true, message: '请选择平级接收人', trigger: 'change'}]
        }
			};
		},
		components: {},
    created() {
      const t = this
      t.form.publishingUnit = t.userInfo.company
      t.getSameLevel()
      t.getAreaUsers()
    },
    computed: {
		},
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
            const treeD = []
            t.userTitTree(res.data.data)
            treeD.push(t.findNodeById(res.data.data,t.userInfo.districtId))
            t.areaUsers = treeD
          }else{
            console.log('暂无数据')
          }
        }else{
          this.$message.warning(res.data.msg);
        }
      },

			//选择子部门部分
			onChanges(value,label,extra) {
        const t = this
        if(t.form.receiver.length == 0){
          t.checkAll = false
        }

        // for(let i of value){
        //   t.form.verticalRecipient = [...t.form.verticalRecipient,...t.findNodeById(t.areaUsers,i.value).users]
        // }
      },

      checkChange(e) {
        const t = this
        this.checkAll = !this.checkAll
        if(t.checkAll == true){
          t.form.receiver = t.traverseTree(t.areaUsers[0])
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

      confirmSend(){
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.form.verticalRecipient = []
            this.form.horizontalRecipient = []
            const aList = this.form.receiver.map(item=>this.findNodeById(this.areaUsers,item.value)?.users)
            if(aList.includes(null)){
              this.$message.error('选择接收单位时存在无用户的单位')
              return
            }
            const newAList = [].concat(...aList)
            for(let i of newAList){
              const {id,roleId,...data} = i
              const {company: recipientUnit,...rest} = data
              const obj = {recipientUnit,recipientType:1,...rest}
              this.form.verticalRecipient.push(obj)
            }
            if(this.form.recipient.length>0){
              const bList = this.form.recipient.map(item => this.filteredOptions.find(i=>i.id == item))
              for(let i of bList){
                const {recipientName: name, company: recipientUnit,...rest} = i
                const obj = {name,recipientUnit,recipientType:2,realName: name,...rest}
                const {id,...noId} = obj
                this.form.horizontalRecipient.push(noId)
              }
            }
            const {receiver,recipient,...data} = this.form
            massSend(data).then( res =>{
              if(res.data.code == 100){
                this.$message.success('信息群发成功')
                this.$refs.ruleForm.clearValidate()
                this.$refs.ruleForm.resetFields()
                this.form.recipient = []
                this.checkAll = false
                this.checkSlAll = false
              }else{
                this.$message.error(res.data.msg)
                this.$refs.ruleForm.clearValidate()
                this.$refs.ruleForm.resetFields()
              }
            })
          }else{
            console.log('error submit!!');
            return false;
          }
        })
      },

      onSearch() {
        // console.log(...arguments);
      },
      onSelect() {
        // console.log(...arguments);
      },
			//选择平级部门部分
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
        function traverse(node) {
          if(node.users && node.users.length>0){
            result.push({ label: node.name, value: node.id });
            if (node.children && node.children.length > 0) {
              for (let child of node.children) {
                traverse(child);
              }
            }
          }
        }
        traverse(treeData);
        return result;
      },

      // 将树状数据新增title字段放入users的姓名电话
      userTitTree(treeData) {
        for(const node of treeData){
          if(node.users){
            node.name = node.name + '('+node.users.map(i=>i.realName +' '+ i.phone).join(',')+')'
          }
          if(node.children){
            this.userTitTree(node.children)
          }
        }
        return treeData
      }
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