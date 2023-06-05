<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="category">
          <a-radio-button value="default">
            全部
          </a-radio-button>
          <a-radio-button value="1">
            紧临
          </a-radio-button>
          <a-radio-button value="2">
            常规
          </a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="16">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="8">
            <a-range-picker
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onChange"
                @ok="onOk"
                style="width: 100%"
            />
          </a-col>
          <a-col :span="4">
            <a-button type="primary">查询</a-button>
            <a-button style="margin-left: 12px">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

	  <!-- 表格实体部分-->
    <div class="table-cont">
      <a-table :columns="columns" :data-source="data" bordered>
        <template #level="text">
          <a-tag :color="text === '黄色' ? 'yellow' :text === '橙色'? 'orange':text === '红色'?'red':'blue'">
            {{ text }}
          </a-tag>
        </template>
        <template #attachment="text">
          <span v-if="text==='无'">无</span>
          <a v-else><b><a-icon type="paper-clip" /> {{text}}</b></a>
        </template >
        <template #operation="text, record, index">
          <div class="editable-row-operations">
          <a @click="showModal" style="color:orangered">
            叫应列表</a>&nbsp;&nbsp;
            <router-link :to="{path:'/details',query: {id: record.id}}">信息详情</router-link>
          </div>
        </template>
      </a-table>
    </div>
	  <!-- 对话框 -->
	  <a-modal title="查看叫应详情" 
	  okText="确认"
	  cancelText="关闭"
	  :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleOk">
	  </a-modal>
  </div>
</template>
<script>
	const columns = [{
			title: '序号',
			dataIndex: 'key',
			width: '8%',
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
			title: '叫应情况',
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
			receipt: '部分叫应'
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
				receipt: '全部叫应'
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
				receipt: '均未叫应'
			}]
	export default {
		data() {
			return {
				category: 'default',
				data,
				columns,
				visible: false,
				confirmLoading: false,
			}
		},
		methods: {
      onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      },
      onOk(value) {
        console.log('onOk: ', value);
      },

			//弹出层
			showModal() {
				this.visible = true;
			},

			handleOk(e) {
				this.visible = false;
			},

		}
		}
		
</script>