<template>
  <div class="inner">
	  <a-radio-group v-model="category">
	  	<a-radio-button value="default">
	  		全部
	  	</a-radio-button>
	  	<a-radio-button value="1">
	  		已审核
	  	</a-radio-button>
	  	<a-radio-button value="2">
	  		未审核
	  	</a-radio-button>
	  </a-radio-group>
	  <div style="float:right">
	  	时间区间筛选：<a-range-picker :placeholder="['开始时间', '结束时间']" @change="onChange" />
	  </div>
	  <br/><br/>
	  <!-- 表格实体部分-->
	  <a-table :columns="columns" :data-source="data" bordered>
		  <span slot="level" slot-scope="text">
		  	<a-tag :color="text === '黄色' ? 'yellow' :text === '橙色'? 'orange':text === '红色'?'red':'blue'">
		  		{{ text }}
		  	</a-tag>
		  </span>
		  <template slot="attachment" slot-scope="text">
		  	<span v-if="text==='无'">无</span>
		  	<a v-else><b><a-icon type="paper-clip" /> {{text}}</b></a>
		  </template >
	  	<template slot="operation" slot-scope="text, record, index">
	  		<div class="editable-row-operations">
				<a-button v-if="record.audit==='已审核'" type="primary" @click="showModal(record.id)" >
					确认发布</a-button>&nbsp;&nbsp;
	  			<router-link :to="{path:'/details',query: {id: record.id}}">信息详情</router-link>
				&nbsp;&nbsp;<a style="color:red">删除</a>
	  		</div>
	  	</template>
	  </a-table>
	  <!-- 对话框 -->
	  <a-modal title="信息发布" 
	  okText="确认发布"
	  cancelText="取消"
	  :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
	  <p>确认发布 “[{{show_id}}]2023年5月23日，全疆黄色高温预警信息”？</p>
	  </a-modal>
  </div>
</template>
<script>
	const columns = [{
			title: '编号',
			dataIndex: 'id',
			width: '8%',
		},
		{
			title: '提交审核时间',
			dataIndex: 'time',
			width: '13%',
			scopedSlots: {
				customRender: 'time'
			}, //设置定制化表格数据
		},
		{
			title: '发布单位',
			dataIndex: 'department',
			width: '12%',
		},
		{
			title: '类别',
			dataIndex: 'category',
			width: '6%',
		},
		{
			title: '级别',
			dataIndex: 'level',
			scopedSlots: {
				customRender: 'level'
			}, //设置定制化表格数据
			width: '6%',
		},
		{
			title: '信息标题',
			dataIndex: 'title',
			width: '16%',
		},
		{
			title: '附件',
			dataIndex: 'attachment',
			width: '6%',
			scopedSlots: {
				customRender: 'attachment'
			},
		},
		{
			title: '审核情况',
			dataIndex: 'audit',
			width: '10%',
			scopedSlots: {
				customRender: 'audit'
			}, //设置定制化表格数据
		},
		{
			title: '操作',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
		},
	];
	const data = [{
			key: 1,
			id:1001,
			readed:false,
			time: '2023年5月3日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '黄色',
			title: '全疆高温红色预警',
			attachment: '1',
			audit: '已审核'
		},
		{
				key: 2,
				id:1002,
				readed:false,
				time: '2023年5月3日 15:30',
				department: '自治区预警中心',
				category: '气象',
				level: '黄色',
				title: '全疆高温红色预警',
				attachment: '1',
				audit: '未审核'
			},{
				key: 3,
				id:1003,
				readed:false,
				time: '2023年5月3日 15:30',
				department: '自治区预警中心',
				category: '气象',
				level: '黄色',
				title: '全疆高温红色预警',
				attachment: '1',
				audit: '已审核'
			}]
	export default {
		data() {
			return {
				category: 'default',
				data,
				columns,
				visible: false,
				confirmLoading: false,
				show_id:''
			}
		},
		methods: {
			showModal(id) {
				this.visible = true;
				this.show_id=id
			},
			//确认发布
			handleOk(e) {
				this.ModalText = '正在发布，请稍候...';
				this.confirmLoading = true;
				setTimeout(() => {
					this.visible = false;
					this.confirmLoading = false;
				}, 2000);
			},
			handleCancel(e) {
				this.visible = false;
			},

		}
		}
		
</script>