<template>
  <a-card title="近期通知" class="projecting">
    <a slot="extra" href="release" class="tapBtn">全部通知</a>
    <a-card-grid style="width:33.33%;text-align:center;cursor: pointer" v-for="(item, index) in lists" :key="'projecting' + index" @click="openDetails(item.id)">
      <div class="title">
        <img :src="img" :alt="item.title">
        <span>{{ getRiskName(item.disasterType)}} {{getLevelName(item.warningLevel)}}</span>
      </div>
      <p>{{ item.content }}</p>
      <div class="project-item">
        <b>{{ item.publishingUnit }}</b>
        <span>{{ item.publishingTime | filterTime }}</span>
      </div>
    </a-card-grid>
    <msg-detail-mod ref="msgDetail"></msg-detail-mod>
  </a-card>
</template>

<script>
import {getPublishRecord} from "@/api/list";
import msgDetailMod from "@/views/Admin/components/msgDetailMod";
export default {
  name: 'projecting',
  components: { msgDetailMod },
  data () {
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
      img: require('@/assets/user.png'),
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
      // lists: [
      //   {
      //     img: require('@/assets/user.png'),
      //     title: '气象 红色预警',//显示灾害种类和对应颜色级别
      //     content: '根据中央气象台消息，全疆近日气温将……',
      //     name: '自治区',
      //     created: '2020-10-12 12:12:12'
      //   }
      // ]
    }
  },
  created() {
    this.getData()
  },
  methods:{
    async getData(){
      const t = this
      const res = await getPublishRecord(t.search)
      if(res.data.code == 100){
        t.lists = res.data.data
      }else{
        this.$message.error(res.data.msg)
      }
    },
    getRiskName(disasterType){
      return this.riskOptions.find(i => i.value === disasterType)?.name;
    },

    getLevelName(warningLevel){
      return this.levelOptions.find(i => i.value === warningLevel)?.name;
    },
    openDetails(id){
      const t = this
      t.$refs.msgDetail.getDetails(id)
      t.$refs.msgDetail.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
.projecting {
  .tapBtn{
    color: #333;
    &:hover{
      color: @link;
    }
  }

  .title {
    text-align: left;
    margin-bottom: 10px;
    img {
      width: 32px;
      height: 32px;
      margin-right: 16px;
    }
    span {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
    }
  }
  p {
    text-align: left;
    height: 44px;
    line-height: 22px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.45);
  }
  .project-item {
    display: flex;
    justify-content: space-between;
    span {
      &:first-child {
        &:hover {
          color: rgb(19, 194, 194);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
