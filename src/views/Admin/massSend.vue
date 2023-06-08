<template>
	<div class="inner">
		<h2>预警信息发布</h2>
    <a-form-model :model="form" :wrapper-col="wrapperCol">
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
          <a-form-model-item prop="type">
            <a-radio-group v-model="form.type" default-value="a" button-style="solid">
              <a-radio-button value="a">
                常规
              </a-radio-button>
              <a-radio-button value="b">
                紧临
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="12" style="display: flex;align-items: center;justify-content: right">
          <a-form-model-item prop="riskType" style="margin-right: 20px">
            <a-select placeholder="请选择相关灾种" v-model="form.riskType" style="width: 240px" allowClear @change="handleRisk">
              <a-select-option v-for="item in riskOptions" :key="item.value" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item prop="level">
            <a-select placeholder="请选择预警级别" v-model="form.level" style="width: 240px" allowClear @change="handleLevel">
              <a-select-option v-for="item in levelOptions" :key="item.value" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item prop="message">
			  <a-textarea v-model="form.message" placeholder="请输入短信通知内容部分" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </a-form-model-item>
      <a-row>
        <a-col :span="12">
          <a-button>上传附件</a-button>
        </a-col>
        <a-col :span="12" style="display: flex;align-items: center;justify-content: right">
          <b style="margin-bottom: 24px">超时设置：</b>
          <a-form-model-item prop="overTime">
            <a-input v-model="form.overTime" style="width:200px;" placeholder="输入时间" suffix="分钟"/>
          </a-form-model-item>
        </a-col>
      </a-row>
			<span><b>发布单位：</b>{{department}}</span>
			<br/><br/>
			<!-- 子单位-->
      <a-row :gutter="24">
        <a-col :span="12">
			    <b style="margin-bottom: 6px">选择接收单位：</b>
          <a-form-model-item prop="svalue">
            <a-tree-select
                show-search
                tree-checkable
                treeCheckStrictly
                style="width: 100%"
                v-model="form.svalue"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="选择工作通知接收单位"
                allow-clear
                multiple
                tree-default-expand-all
                @change="onChanges"
                @search="onSearch"
                @select="onSelect"
              >
              <a-tree-select-node key="0" value="all" title="全选">
              </a-tree-select-node>
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
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <b style="margin-bottom: 6px">平级接收人选择：</b>
          <a-form-model-item prop="sameDep">
            <a-select mode="multiple" placeholder="选择平级接收单位" v-model="form.sameDep" @change="handle">
              <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
                {{ item }}
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
        <a-button type="primary" style="width: 250px;">
          确认发送
        </a-button>
      </div>
		</div>

		<div class="right">
			<h2>短信预览</h2>
			<div class="mobile">
				<div class="mesg">
					<P>【{{form.title}}】{{form.message}}。发布单位：{{department}}</P>
				</div>

			</div>
		</div>
    </a-form-model>
	</div>
</template>

<script>

	
	const OPTIONS = ['自治区消防（李XX）', '自治区公安厅（王XX）', '自治区自然资源厅（刘XX）'];
	export default {
		name: "release",
		data() {
			return {
				message: '',
				signname: '自然灾害风险预警提示',
				department: '自治区自然灾害综合监测预警中心',
        wrapperCol: { span: 24 },
        form: {
          title: '',
          riskType: 1,
          level: 1,
          type: 'a',
          svalue: undefined,
          sameDep: [],
          message: '',
          overTime: ''
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
          {name: '蓝色预警',value: 4},
          {name: '其他短信通知',value: 5}
        ]
			};
		},
		components: {},
		computed: {
			filteredOptions() {
				return OPTIONS.filter(o => !this.form.sameDep.includes(o));
			},
		},
		methods: {
			//选择子部门部分
			onChanges(value) {
            if(value.find(i=>i.value == 'all')){
              console.log('全选了')
            }else{
              this.svalue = value;
            }
            console.log(this.svalue);
			    },
      onSearch() {
        console.log(...arguments);
      },
      onSelect() {
        console.log(...arguments);
      },
			//选择平级部门部分
      handleRisk(selectedItems) {
        // this.selectedItems = selectedItems;
      },
      handleLevel(selectedItems) {
        // this.selectedItems = selectedItems;
      },
			handle(selectedItems) {
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