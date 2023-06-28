<template>
  <a-card title="快捷操作" class="quick">
    <a-tooltip overlayClassName="tip">
      <template #title v-if="toResponse == 0">
        暂无待叫应信息
      </template>
      <a :class="toResponse>0?'resColor':''" @click="toRes" v-if="userinfo.role.id == 3 && userinfo.unittype !==1">待叫应<span v-if="toResponse > 0">（{{toResponse}}）</span></a>
    </a-tooltip>

    <a-tooltip overlayClassName="tip">
      <template #title v-if="toReview == 0">
        暂无待审核信息
      </template>
      <a :class="toReview>0?'resColor':''" @click="toRev" v-if="userinfo.role.id == 2">待审核<span v-if="toReview > 0">（{{toReview}}）</span></a>
    </a-tooltip>
  <a href="massSend" v-if="userinfo.role.id == 3">发布通知</a>
  <a-tooltip overlayClassName="tip">
    <template #title>
      数据统计模块待呈现
    </template>
    <a>查看统计</a>
  </a-tooltip>
  <a href="user" v-if="userinfo.role.id == 3">用户管理</a>
    <!-- <a-button><a-icon type="plus" />添加</a-button> -->
  </a-card>
</template>

<script>
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import {getMsgRecord, getResponseRecord} from "@/api/list";
import {getUserInfo} from "@/util/storage";
import {getReviewRecord} from "@/api/review";

export default {
  name: 'quick-navigation',
  data() {
    return {
      userinfo: getUserInfo(),
      toResponse: null,
      toReview: null,
    };
  },
  created() {
    const t = this
    t.getResData()
    t.getReviewData()
  },
  methods: {
    async getResData(){
      const t = this
      const res = await getMsgRecord({
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          responseStatus: 1,
          startTime: '',
          endTime: ''
        }
      })
      if(res.data.code == 100){
        t.toResponse = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    async getReviewData(){
      const t = this
      const res = await getReviewRecord({
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          reviewStatus: 1,
          startTime: '',
          endTime: ''
        }
      })
      if(res.data.code == 100){
        t.toReview = res.data.total
      }else{
        this.$message.error(res.data.msg)
      }
    },

    toRes(){
      if(this.toResponse>0){
        this.$router.push({
          name: 'list',
          query: {
            type: 1
          }
        })
      }
    },
    toRev(){
      if(this.toReview>0){
        this.$router.push({
          name: 'msgReview',
          query: {
            type: 1
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.quick {
  a {
    display: inline-block;
    text-align: center;
    width: 25%;
    font-size: 14px;
    margin-bottom: 13px;
    color: #333;

    &:hover{
      color: @link;
    }
  }
  .resColor{
    color: @danger;
  }
}
</style>
<style lang="less">
.tip{
  .ant-tooltip-inner {
  // 这里是框框
    color: #333;
    background-color: #fff!important;
  }
  .ant-tooltip-arrow::before {
  // 这里是小三角形
    background-color: #fff!important;
  }
}
</style>