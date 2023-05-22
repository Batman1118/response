<template>
  <a-card title="各地区统计数据">
    <div class="item" v-for="(item, index) in lists" :key="'team' + index">
      <a style="border: 1px solid #1890ff;padding: 5px 8px;border-radius: 5px;">{{ item.title }}</a>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'Team',
  data () {
    return {
      lists: [
        {
          title: '全疆汇总',
		  url:''
        },
        {
          title: '乌鲁木齐市',
		  url:''
        },
        {
          title: '吐鲁番市',
		  url:''
        },
        {
          title: '昌吉市',
		  url:''
        },
        {
          title: '巴音郭楞蒙古自治州',
		  url:''
        },
        {
          title: '伊犁哈萨克自治州',
		  url:''
        },
        {
          title: '阿克苏地区',
		  url:''
        },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  width: 50%;
  display: inline-block;
  margin-bottom: 20px;
  img {
    width: 32px;
    height: 32px;
    margin-right: 20px;
  }
}
</style>
