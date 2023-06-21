<template>
  <a-card title="最新审核记录">
    <a slot="extra" href="msgReview" class="tapBtn">更多记录</a>
    <a-list item-layout="horizontal" :data-source="lists">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.gmtReviewSubmit | filterTime"
        >
          <a slot="title" v-if="item.reviewStatus == 1" href="#" @click="openDetails(item.id)">{{item.title}} <span class="orange">未审核</span></a>
          <a slot="title" v-if="item.reviewStatus == 2" href="#" @click="openDetails(item.id)">{{item.title}} <span class="blue">已审核</span></a>
          <a slot="title" v-if="item.reviewStatus == 3" href="#" @click="openDetails(item.id)">{{item.title}} <span class="red">审核已驳回</span></a>
          <a-avatar
            slot="avatar"
            :src="userImg"
          />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <msg-detail-mod ref="msgDetail"></msg-detail-mod>
  </a-card>
</template>

<script>
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
import {getResponseRecord} from "@/api/list";
import {getReviewRecord} from "@/api/review";

export default {
  name: "Dynamic",
  components: { msgDetailMod },
  data() {
    return {
      search:{
        pageIndex: 1,
        pageSize: 10,
        searchParams:{
          reviewStatus: null,
          startTime: '',
          endTime: ''
        }
      },
      lists: [],
      userImg: require('@/assets/user.png')
    };
  },
  created() {
    this.getData()
  },
  methods: {
    async getData(){
      const t = this
      const res = await getReviewRecord(this.search)
      if(res.data.code == 100){
        t.lists = res.data.data
      }else{
        this.$message.error(res.data.msg)
      }
    },
    openDetails(id){
      const t = this
      t.$refs.msgDetail.getDetails(id)
      t.$refs.msgDetail.visible = true
    }
  }
};
</script>
<style lang="less" scoped>
.tapBtn{
  color: #333;
  &:hover{
    color: @link;
  }
}
.blue{
  color: @base;
}

.orange{
  color: @warning;
}
.red{
  color: @danger;
}
</style>