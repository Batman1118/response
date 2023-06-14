<template>
	<div class="inner">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col :span="8">
        <a-radio-group v-model="search.searchParams.responseStatus" @change="getData">
          <a-radio-button :value="null">
            全部
          </a-radio-button>
          <a-radio-button :value="1">
            待叫应
          </a-radio-button>
          <a-radio-button :value="2">
            已叫应
          </a-radio-button>
          <a-radio-button :value="3">
            超时未叫应
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
      <a-table :columns="columns" :data-source="data" bordered :pagination="pagination">
        <template #index="text,record,index">
          {{index + 1}}
        </template>
        <template #publishingTime="text,record">
          <span v-if="record.readStatus==0" style="color:red">[未读]</span>{{text}}
        </template>
        <template #disasterType="text">
            {{ getRiskName(text) }}
        </template>
        <template #warningLevel="text">
          <a-tag :color="text === 3 ? 'yellow' :text === 2? 'orange':text === 1?'red':'blue'">
            {{ getLevelName(text) }}
          </a-tag>
        </template>
        <template #attachment="text">
          <a><b><a-icon type="paper-clip" /> {{text}}</b></a>
        </template >
        <template #responseStatus="text">
          <a-tag :color="text === 3 ? 'red' :text === 2? 'green':text === 1?'orange':'blue'">
            {{text == 1 ? '待叫应' : text == 2 ?'已叫应':text == 3 ?'超时未叫应' : ''}}
          </a-tag>
        </template>
<!--        <template #operation="text, record, index">-->
<!--          <div class="editable-row-operations">-->
<!--            <div v-if="record.responseStatus==='待叫应'">-->
<!--              <a @click="showModal" style="color:orangered"><a-icon type="notification" />-->
<!--                确认已收到</a>&nbsp;&nbsp;-->
<!--            </div>-->
<!--            <br />-->
<!--            <a-button type="primary">转发</a-button>&nbsp;&nbsp;-->
<!--            <a-button type="link" @click="viewDetails(item)">查看详情</a-button>-->
<!--          </div>-->
<!--        </template>-->
        <template #operation="text, record, index">
          <a-button type="primary" v-if="record.responseStatus == 1" style="margin-right: 12px" @click="confirmResponce(record.id)">确认已收到</a-button>
          <a-button type="primary" @click="openMod('repost',record)">转发</a-button>
          <a-button type="link" @click="openMod('view',record)">查看详情</a-button>
        </template>
      </a-table>
    </div>
    <msg-edit-mod ref="msgEdit" @refresh="getData"></msg-edit-mod>
		<!-- 对话框 -->
<!--		<a-modal title="回执" -->
<!--		okText="确认已安排部署"-->
<!--		cancelText="取消"-->
<!--		:visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"-->
<!--			@cancel="handleCancel">-->
<!--			<p>{{ ModalText }}</p>-->
<!--		</a-modal>-->
	</div>
</template>

<script>
import {getMsgRecord, readById, responseMsg} from "@/api/list";
import msgEditMod from "@/views/Admin/components/msgEditMod";
import {publishMsg} from "@/api/send";
import {getReviewDetail, getReviewDetailByWorker} from "@/api/review";

  export default {
    name: 'list',
    components: { msgEditMod },
		data() {
			return {
        search:{
          pageIndex: 1,
          pageSize: 10,
          searchParams:{
            responseStatus: null,
            startTime: '',
            endTime: ''
          }
        },
        timeRange: [],
        columns:[
          {
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            scopedSlots: {
              customRender: 'index'
            },
          },
          {
            title: '发布时间',
            dataIndex: 'publishingTime',
            width: '15%',
            scopedSlots: {
              customRender: 'publishingTime'
            }, //设置定制化表格数据
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
            width: '6%',
            scopedSlots: {
              customRender: 'attachment'
            },
          },
          {
            title: '叫应状态',
            dataIndex: 'responseStatus',
            width: '10%',
            scopedSlots: {
              customRender: 'responseStatus'
            }, //设置定制化表格数据
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: {
              customRender: 'operation'
            },
          },
        ],
				data: [],
        pagination: {
          current: 1,
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: 0,
          onChange: ( page, pageSize ) => this.onPageChange(page,pageSize),
          showTotal: total => `共 ${total} 条`
        },
        total: null,
        details: {},
				editingKey: '',
				category: 'default',
				ModalText: '确认已经安排部署？',
				visible: false,
				confirmLoading: false,
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
			};
		},
    created() {
      const t = this
      t.getData()
    },
    methods: {
      async getData(){
        const t = this
        const res = await getMsgRecord(this.search)
        if(res.data.code == 100){
          t.data = res.data.data
          t.pagination.total = res.data.total
        }else{
          this.$message.error(res.data.msg)
        }
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

      resetSearch(){
        const t = this
        t.search = {
          pageIndex: 1,
          pageSize: 10,
          searchParams:{
            responseStatus: null,
            startTime: '',
            endTime: ''
          }
        }
        t.timeRange = []
        t.getData()
      },

      confirmResponce(id){
        const t = this
        this.$confirm({
          title: '回执',
          content: h => <div>确认已安排部署？</div>,
          cancelText: '取消',
          okText: '确认',
          centered: true,
          async onOk() {
            let res = await responseMsg(id)
            if(res.data.code == 100){
              t.$message.success('信息叫应成功');
              t.getData()
            }else{
              t.$message.warning(res.data.msg);
            }
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      },

      openMod(type,data){
        const t = this
        getReviewDetailByWorker(data.warnInfoId).then(res=>{
          if(res.data.code == 100){
            if(res.data.data){
              t.read(data.id)
              t.$refs.msgEdit.openMod(type,res.data.data)
            }else{
              t.$message.error('查询信息详情失败')
            }
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },

      async read(id){
        const t = this
        const res = await readById(id)
        if(res.data.code == 100){
          console.log('已读')
        }else{
          t.$message.error('设置已读出错')
        }
      },

      getRiskName(disasterType){
        return this.riskOptions.find(i => i.value === disasterType)?.name;
      },

      getLevelName(warningLevel){
        return this.levelOptions.find(i => i.value === warningLevel)?.name;
      },

			handleChange(value) {
				console.log(`Selected: ${value}`);
			},
			popupScroll() {
				console.log('popupScroll');
			},

      timeOk(value) {
        console.log('timeOk: ', value);
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