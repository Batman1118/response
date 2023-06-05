<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  margin: 0px;
  padding: 0px;
}
.inner{
	background-color: #fff;padding: 20px 10px;
	height: 88vh;
  overflow: hidden;
  overflow-y: scroll;
}
.ftright{
	float:right;
}
</style>
