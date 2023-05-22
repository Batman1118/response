<template>
	<div class="inner">
		<a-radio-group v-model="category">
			<a-radio-button value="default">
				全部
			</a-radio-button>
			<a-radio-button value="1">
				待叫应
			</a-radio-button>
			<a-radio-button value="2">
				已叫应
			</a-radio-button>
			<a-radio-button value="3">
				超时未叫应
			</a-radio-button>
		</a-radio-group>
		<div style="float:right">
			时间区间筛选：<a-range-picker :placeholder="['开始时间', '结束时间']" @change="onChange" />
		</div>
		<br /><br />
		<!-- 表格实体部分-->
		<a-table :columns="columns" :data-source="data" bordered>
			<template slot="time" slot-scope="text,record">
				<a v-if="!record.readed" style="color:red">[未读]</a>{{text}}
			</template>
			<span slot="level" slot-scope="text">
				<a-tag :color="text === '黄色' ? 'yellow' :text === '橙色'? 'orange':text === '红色'?'red':'blue'">
					{{ text }}
				</a-tag>
			</span>
			<template slot="attachment" slot-scope="text">
				<span v-if="text==='无'">无</span>
				<a v-else><b><a-icon type="paper-clip" /> {{text}}</b></a>
			</template >
			<template slot="receipt" slot-scope="text">
				<span v-if="text=='待叫应'"
					style='background-color:blue;padding:5px;color:#fff;border-radius: 5px;'>{{text}}</span>
				<span v-else-if="text=='已叫应'"
					style='background-color:limegreen;padding:5px;color:#2a2a2a;border-radius: 5px;'>{{text}}</span>
				<span v-else style='background-color:red;padding:5px;color:#fff;border-radius: 5px;'>{{text}}
				</span>
			</template>
			<template slot="operation" slot-scope="text, record, index">
				<div class="editable-row-operations">
					<div v-if="record.receipt==='待叫应'">
						<a @click="showModal" style="color:orangered"><a-icon type="notification" />
							确认已收到</a>&nbsp;&nbsp;
					</div>
					<br />
					<router-link :to="{path:'/torelease'}">转发</router-link>&nbsp;&nbsp;
					<router-link :to="{path:'/details',query: {id: record.id}}">查看详情</router-link>
				</div>
			</template>
		</a-table>
		<!-- 对话框 -->
		<a-modal title="回执" 
		okText="确认已安排部署"
		cancelText="取消"
		:visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
			@cancel="handleCancel">
			<p>{{ ModalText }}</p>
		</a-modal>
	</div>
</template>

<script>
	const columns = [{
			title: '序号',
			dataIndex: 'key',
			width: '5%',
		},
		{
			title: '发布时间',
			dataIndex: 'time',
			width: '15%',
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
			width: '8%',
		},
		{
			title: '级别',
			dataIndex: 'level',
			scopedSlots: {
				customRender: 'level'
			}, //设置定制化表格数据
			width: '8%',
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
			title: '叫应状态',
			dataIndex: 'receipt',
			width: '10%',
			scopedSlots: {
				customRender: 'receipt'
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
			receipt: '待叫应'
		},
		{
			key: 2,
			readed:true,
			id:1002,
			time: '2023年5月2日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '橙色',
			title: '全疆高温红色预警',
			attachment: '1',
			receipt: '已叫应'
		},
		{
			key: 3,
			readed:true,
			id:1003,
			time: '2023年5月1日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '橙色',
			title: '全疆高温红色预警',
			attachment: '1',
			receipt: '已叫应'
		},
		{
			key: 4,
			readed:true,
			id:1004,
			time: '2023年5月1日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '橙色',
			title: '全疆高温红色预警',
			attachment: '2',
			receipt: '超时未叫应'
		},
		{
			key: 5,
			readed:true,
			id:1005,
			time: '2023年4月21日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '橙色',
			title: '全疆高温红色预警',
			attachment: '无',
			receipt: '已叫应'
		},
		{
			key: 6,
			readed:true,
			id:1006,
			time: '2023年4月21日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '橙色',
			title: '全疆高温红色预警',
			attachment: '1',
			receipt: '已叫应'
		},
		{
			key: 7,
			readed:true,
			id:1007,
			time: '2023年1月21日 15:30',
			department: '自治区预警中心',
			category: '气象',
			level: '红色',
			title: '全疆低温红色预警',
			attachment: '1',
			receipt: '已叫应'
		},

	];

	export default {
		data() {
			this.cacheData = data.map(item => ({
				...item
			}));
			return {
				data,
				columns,
				editingKey: '',
				category: 'default',
				ModalText: '确认已经安排部署？',
				visible: false,
				confirmLoading: false,
			};
		},
		methods: {
			handleChange(value) {
				console.log(`Selected: ${value}`);
			},
			popupScroll() {
				console.log('popupScroll');
			},
			onChange(date, dateString) {
				console.log(date, dateString);
			},
			//叫应回执时间
			showModal() {
				this.visible = true;
			},
			handleOk(e) {
				this.ModalText = '正在提交您的叫应状态...';
				this.confirmLoading = true;
				setTimeout(() => {
					this.visible = false;
					this.confirmLoading = false;
				}, 2000);
			},
			handleCancel(e) {
				this.visible = false;
			},
		},
	};
</script>

<style>

</style>