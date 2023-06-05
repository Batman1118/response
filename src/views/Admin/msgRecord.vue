<template>
  <div class="inner">
    <a-row type="flex" :gutter="12" style="margin-bottom: 20px">
      <a-col :span="6">
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
    <div class="table-cont">
      <div class="msg">
        <a-card hoverable class="msg-item" v-for="item in msg" :key="item.id">
          <template #title>
            <div class="tit">
              发送时间：<span>{{item.time}}</span>
            </div>
            <a-divider type="vertical" />
            <div class="tit">
              任务ID：<span>{{item.id}}</span>
            </div>
          </template>
          <p>
            {{item.content}}
          </p>
          <template #actions>
            <div>
              接收号码：<span>{{item.phone.join(',')}}</span>
            </div>
            <div>
              <a-button type="primary" @click="viewDetails">查看详情</a-button>
            </div>
          </template>
        </a-card>
      </div>
    </div>
    <a-modal v-model="visible" width="50%" title="短信详情" @ok="handleOk" cancelText="取消" okText="确认">
      短信详情
    </a-modal>
  </div>
</template>

<script>
import {getUser} from '@/api/user'
export default {
  name: 'msgRecord',
  components: {},
  data () {
    return {
      msg: [
        {
          time: '2023-05-30',
          id: '1201',
          content: '第一条短信',
          phone: ['15261806176','15261806176','15261806176','15261806176','15261806176','15261806176','15261806176','15261806176','15261806176']
        },
        {
          time: '2023-05-30',
          id: '1202',
          content: '第二条短信',
          phone: ['15261806176','15261806176','15261806176','15261806176','15261806176']
        },
        {
          time: '2023-05-30',
          id: '1203',
          content: '第三条短信',
          phone: ['15261806176','15261806176','15261806176','15261806176','15261806176']
        }
      ],
      visible: false
    }
  },
  created() {
    const t = this
  },
  methods:{
    onChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    },
    onOk(value) {
      console.log('onOk: ', value);
    },
    viewDetails(){
      const t = this
      t.visible = true
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.msg{
  width: 100%;
  margin-bottom: 12px;

  .msg-item{
    width: 100%;
    margin-bottom: 24px;

    /deep/ .ant-card-head-title{
      display: flex;
      align-items: center;
      .tit{
        width: 50%;
      }
    }
    /deep/ .ant-card-actions{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      li{
        width: 10% !important;
      }
      &>li:first-of-type{
        width: 90% !important;

        div{
          color: #333;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

</style>
