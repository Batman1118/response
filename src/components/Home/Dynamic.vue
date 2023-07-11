<template>
  <a-card title="最新叫应记录">
    <a slot="extra" href="callRecord" class="tapBtn">查看全部</a>
    <a-list item-layout="horizontal" :data-source="lists">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.responseTime | filterTime"
        >
          <a slot="title" href="#" @click="openDetails(item.warnInfoId)">{{item.receiveUnit}} 的 {{ item.responseRealName }} 在 {{item.title}} 进行了“已安排部署”叫应</a>
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

export default {
  name: "Dynamic",
  components: { msgDetailMod },
  data() {
    return {
      search:{
        pageIndex: 1,
        pageSize: 6,
        searchParams:{
          emergType: null,
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
      const res = await getResponseRecord(this.search)
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
</style>