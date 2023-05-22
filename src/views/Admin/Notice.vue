<template>
	<div class="inner">
		<h2>预警信息发布</h2>
		<div class="left">
			<a-input placeholder="请输入标题" style="height: 50px; font-size: 20px;" />
			<br /><br />
			<a-radio-group v-model="value" @change="onChange">
				<a-radio :value="1">
					蓝色
				</a-radio>
				<a-radio :value="2">
					黄色
				</a-radio>
				<a-radio :value="3">
					橙色
				</a-radio>
				<a-radio :value="4">
					红色
				</a-radio>
			</a-radio-group>
			<br /><br />
			<a-radio-group default-value="a" button-style="solid">
				<a-radio-button value="a">
					常规
				</a-radio-button>
				<a-radio-button value="b">
					紧临
				</a-radio-button>
			</a-radio-group>
			<div class="ftright">
				平级接收人选择：
				<a-select mode="multiple" placeholder="选择平级接收单位" :value="selectedItems" style="width: 180px"
					@change="handle">
					<a-select-option v-for="item in filteredOptions" :key="item" :value="item">
						{{ item }}
					</a-select-option>
				</a-select>
				
			</div>

			<br /><br />
			<a-textarea v-model="message" placeholder="请输入短信通知内容部分" :auto-size="{ minRows: 3, maxRows: 5 }" />
			<br /><br />
			<a-button>上传附件</a-button>  <div style="float: right;width:50%;text-align: right;">超时设置： <a-input style="width:100px;" placeholder="输入时间" /> 分钟</div>
			<br /><br />
			<span><b>发布单位：</b>{{department}}</span>
			<br/><br/>
			<!-- 子单位-->
			<b>选择接收单位：</b>
			<a-tree-select
			    show-search
			    style="width: 100%"
			    :value="svalue"
			    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
			    placeholder="选择工作通知接收单位"
			    allow-clear
			    multiple
			    tree-default-expand-all
			    @change="onChanges"
			    @search="onSearch"
			    @select="onSelect"
			  >
			    <a-tree-select-node key="0-1" value="乌鲁木齐" title="乌鲁木齐(张XX 13268813610)">
			      <a-tree-select-node key="0-1-1" value="米东区" title="米东区(张XX 13268813610)">
			        <a-tree-select-node key="0-1-1-1" value="XX村1" title="XX村(李有田 13268813610)" />
			      </a-tree-select-node>
			      <a-tree-select-node key="0-1-2" value="天山区" title="天山区">
			        <a-tree-select-node key="0-1-2-1" value="XX村2">
			          <b slot="title" style="color: #08c">XX村</b>
			        </a-tree-select-node>
			      </a-tree-select-node>
			    </a-tree-select-node>
			  </a-tree-select>
			  
			  <br/><br/>
			<div style="float: right;"><b>选择审批领导：</b> <a-select show-search placeholder="请选择审批领导"
					option-filter-prop="children" style="width: 200px" :filter-option="filterOption"
					@focus="handleFocus" @blur="handleBlur" @change="handleChange">
					<a-select-option value="jack">
						裴小威
					</a-select-option>
					<a-select-option value="lucy">
						赵东升
					</a-select-option>
					<a-select-option value="tom">
						王卫萍
					</a-select-option>
				</a-select></div>
			<br /><br />
			<a-button type="primary" class="ftright">
				确认并提交审核
			</a-button>
		</div>

		<div class="right">
			<h2>短信预览</h2>
			<div class="mobile">
				<div class="mesg">
					<P>【{{signname}}】{{message}}。发布单位：{{department}}</P>
				</div>

			</div>
		</div>

	</div>
</template>

<script>

	
	const OPTIONS = ['自治区消防（李XX）', '自治区公安厅（王XX）', '自治区自然资源厅（刘XX）'];
	export default {
		name: "release",
		data() {
			return {
				value: 1,
				message: '',
				signname: '自然灾害风险预警提示',
				department: '自治区自然灾害综合监测预警中心',
				selectedItems: [],
				svalue:undefined,
			};
		},
		components: {},
		computed: {
			filteredOptions() {
				return OPTIONS.filter(o => !this.selectedItems.includes(o));
			},
		},
		methods: {
			//选择子部门部分
			onChanges(value) {
			      console.log(value);
			      this.svalue = value;
			    },
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