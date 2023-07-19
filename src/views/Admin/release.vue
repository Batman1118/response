<template>
  <div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="search.searchParams.emergType" @change="getData">
          <a-radio-button :value="null">
            全部
          </a-radio-button>
          <a-radio-button :value="1">
            紧临
          </a-radio-button>
          <a-radio-button :value="2">
            常规
          </a-radio-button>
        </a-radio-group>
      </a-col>
      <a-col :span="16">
        <a-row type="flex" justify="end" :gutter="12">
          <a-col :span="8">
            <a-range-picker
                v-model="timeRange"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="timeChange"
                @ok="timeOk"
                style="width: 100%"
            />
          </a-col>
          <a-col :span="4">
            <a-button type="primary" @click="getData">查询</a-button>
            <a-button style="margin-left: 12px" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

	  <!-- 表格实体部分-->
    <div class="table-cont">
      <a-table :columns="columns" :data-source="data" bordered :pagination="pagination" :rowKey="record=>record.id">
        <template #index="text,record,index">
          {{ index + 1 }}
        </template>
        <template #publishingTime="text">
          {{ text }}
        </template>
        <template #publishingUnit="text">
          {{ text }}
        </template>
        <template #disasterType="text">
          {{ getRiskName(text) }}
        </template>
        <template #warningLevel="text">
          <a-tag :color="text === 3 ? 'yellow' :text === 2? 'orange':text === 1?'red':'blue'">
            {{ getLevelName(text) }}
          </a-tag>
        </template>
        <template #attachment="attachment">
          <span v-if="attachment===null|| attachment===[]">无</span>
          <div v-else>
            <a-button @click="viewFile(item)" type="link" v-for="(item,index) in attachment" :key="index"><a-icon type="paper-clip"/>{{item.attachmentName}}</a-button>
          </div>
        </template >
        <template #responsesRate="text">
          <a-tag :color="Number(text.split('%')[0]) == 100 ? 'green' :Number(text.split('%')[0]) == 0? 'red':'orange'">
            {{ text }}
          </a-tag>
        </template>
        <template #operation="text, record, index">
          <a-button type="primary" @click="openList(record.id)">叫应列表</a-button>
          <a-button type="link" @click="openDetails(record.id)">查看详情</a-button>
        </template>
      </a-table>
      <msg-detail-mod ref="msgDetail"></msg-detail-mod>
      <call-list-mod ref="callList" @refresh="getData"></call-list-mod>
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
import {getMsgRecord, getPublishRecord} from "@/api/list";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import callListMod from "@/views/Admin/components/callListMod";
import {getReviewDetailByWorker} from "@/api/review";
import axios from "axios";
import Cookies from "js-cookie";
import {getUserInfo} from "@/util/storage";
  const columns = [{
			title: '序号',
			dataIndex: 'index',
			width: '8%',
      scopedSlots: {
        customRender: 'index'
      }
		},
		{
			title: '发布时间',
			dataIndex: 'publishingTime',
			width: '15%',
			scopedSlots: {
				customRender: 'publishingTime'
			} //设置定制化表格数据
		},
		{
			title: '发布单位',
			dataIndex: 'publishingUnit',
			width: '12%',
		},
    {
      title: '灾种',
      dataIndex: 'disasterType',
      width: '8%',
      scopedSlots: {
        customRender: 'disasterType'
      }
    },
    {
      title: '预警级别',
      dataIndex: 'warningLevel',
      scopedSlots: {
        customRender: 'warningLevel'
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
			width: '15%',
			scopedSlots: {
				customRender: 'attachment'
			},
		},
		{
			title: '叫应情况',
			dataIndex: 'responsesRate',
			width: '10%',
			scopedSlots: {
				customRender: 'responsesRate'
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
	export default {
    name: 'release',
    components: { msgDetailMod, callListMod },
		data() {
			return {
        search:{
          pageIndex: 1,
          pageSize: 10,
          searchParams:{
            emergType: null,
            startTime: '',
            endTime: ''
          }
        },
        timeRange: [],
				category: 'default',
				data:[],
				columns,
				visible: false,
				confirmLoading: false,
        pagination: {
          current: 1,
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: 0,
          onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
          showTotal: total => `共 ${total} 条`
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
        ]
			}
		},
    mounted() {
      if(getUserInfo().role.id == 1){
        this.columns = this.columns.filter(i=>i.dataIndex !== 'operation')
      }
    },
    created() {
      const t = this
      t.getData()
    },
		methods: {
      async getData(){
        const t = this
        const res = await getPublishRecord(this.search)
        if(res.data.code == 100){
          t.data = res.data.data
          t.pagination.total = res.data.total
        }else{
          this.$message.error(res.data.msg)
        }
      },

      openList(id){
        const t = this
        t.$refs.callList.openMod(id)
      },

      openDetails(id){
        const t = this
        t.$refs.msgDetail.getDetails(id)
        t.$refs.msgDetail.visible = true
      },

      onPageChange(page, pageSize) {
        const t= this
        t.pagination.current = page
        t.search.pageIndex = page
        t.getData()
      },

      timeChange(value, dateString) {
        const t = this
        if(dateString){
          t.search.searchParams.startTime = value[0].format('YYYY-MM-DD 00:00:00')
          t.search.searchParams.endTime = value[1].format('YYYY-MM-DD 23:59:59')
        }
      },

      viewFile(item){
        const t = this
        const { baseUrl } = require('../../../config/env.' + process.env.NODE_ENV)
        axios.get(baseUrl + item.attachment,{headers:{'Content-Type': 'application/json','tk': `${Cookies.get('resTk')}`,'uid':`${Cookies.get('resUid')}`},responseType: 'blob'}).then(res=>{
          if (res) {
            const link = document.createElement('a')
            let blob = new Blob([res.data],{type: res.data.type})
            link.style.display = "none";
            link.href = URL.createObjectURL(blob); // 创建URL
            link.setAttribute("download", item.attachmentName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            this.$message.error('获取文件失败')
          }
        })
      },

      timeOk(value) {
        console.log('onOk: ', value);
      },

      resetSearch(){
        const t = this
        t.search = {
          pageIndex: 1,
          pageSize: 10,
          searchParams:{
            emergType: null,
            startTime: '',
            endTime: ''
          }
        }
        t.timeRange = []
        t.getData()
      },

			//弹出层
			showModal() {
				this.visible = true;
			},

			handleOk(e) {
				this.visible = false;
			},
      getRiskName(disasterType){
        return this.riskOptions.find(i => i.value === disasterType)?.name;
      },

      getLevelName(warningLevel){
        return this.levelOptions.find(i => i.value === warningLevel)?.name;
      }

		}
		}
		
</script>