<template>
  <a-card title="近期通知" class="projecting">
    <a slot="extra" href="#" style="color: rgb(19, 194, 194)">全部通知</a>
    <a-card-grid style="width:33.33%;text-align:center" v-for="(item, index) in lists" :key="'projecting' + index">
      <div class="title">
        <img :src="item.img" :alt="item.title">
        <span>{{ item.title }}</span>
      </div>
      <p>{{ item.content }}</p>
      <div class="project-item">
        <b>{{ item.name }}</b>
        <span>{{ item.created | filterTime }}</span>
      </div>
    </a-card-grid>
  </a-card>
</template>

<script>
export default {
  name: 'projecting',
  data () {
    return {
      lists: [
        { 
          img: require('@/assets/user.png'),
          title: '气象 红色预警',//显示灾害种类和对应颜色级别
          content: '根据中央气象台消息，全疆近日气温将……',
          name: '自治区',
          created: '2020-10-12 12:12:12'
        },
        { 
          img: require('@/assets/user.png'),
          title: '气象 红色预警',
          content: '今日阿勒泰地区将持续低温，请各单位……',
          name: '阿勒泰地区',
          created: '2021-08-21 12:12:12'
        },
        { 
          img: require('@/assets/user.png'),
          title: '气象 黄色预警',
          content: '根据中央气象台消息，全疆近日气温将……',
          name: '自治区',
          created: '2022-10-12 12:12:12'
        },
        { 
          img: require('@/assets/user.png'),
          title: '气象 红色预警',
          content: '根据中央气象台消息，全疆近日气温将……',
          name: '自治区',
          created: '2022-08-21 12:12:12'
        },
        { 
          img: require('@/assets/user.png'),
          title: '气象 红色预警',
          content: '根据中央气象台消息，全疆近日气温将……',
          name: '自治区',
          created: '2022-10-12 12:12:12'
        },
        { 
          img: require('@/assets/user.png'),
          title: '气象 红色预警',
          content: '根据中央气象台消息，全疆近日气温将……',
          name: '自治区',
          created: '2022-08-25 12:12:12'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.projecting {
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
