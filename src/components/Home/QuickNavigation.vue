<template>
  <a-card title="快捷操作" class="quick">
	<a style="color:blue">待叫应（1）</a>
	<a >待审核</a>
    <a>发布通知</a>
    <a>查看统计</a>
    <a>用户管理</a>
    <!-- <a-button><a-icon type="plus" />添加</a-button> -->
  </a-card>
</template>

<script>
export default {
  name: 'quick-navigation'
}
</script>

<style lang="less" scoped>
.quick {
  a {
    display: inline-block;
    width: 25%;
    font-size: 14px;
    margin-bottom: 13px;
    color: #333;
  }
}
</style>
