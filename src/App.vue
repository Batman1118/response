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
  margin: 0;
  padding: 0;
}
.inner{
	background-color: #fff;
  padding: 20px 10px;
	height: 88vh;
  overflow: hidden;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
}
.ftright{
	float:right;
}
</style>
