<template>
  <a-menu
    theme="dark"
    mode="inline"
    :selectedKeys="[$route.path]"
    :openKeys="openKeys"
    @openChange="onOpenChange"
  >
    <a-sub-menu :key="nav.MenuID" v-for="nav in navData">
      <div slot="title">
        <a-icon :type="nav.Icon" />
        <span>{{ nav.MenuTitle }} </span>
      </div>
      <a-menu-item :key="nChild.MenuPath" v-for="nChild in nav.Children">
        <router-link :to="nChild.MenuPath">
          {{ nChild.MenuTitle }}
        </router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script>
import menuData from './menu'
export default {
  name: "menu-sider",
  data() {
    return {
      navData: menuData,
      openKeys: ['1','2','3','4']
    };
  },
  methods: {
    onOpenChange(openKeys) {
      if (openKeys.length !== 0) {
        this.openKeys = [openKeys[1]]
      } else {
        this.openKeys = ['']
      }
    },
  }
};
</script>
