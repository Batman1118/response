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
import menu from './menu'
import { getUserInfo } from "@/util/storage";
export default {
  name: "menu-sider",
  data() {
    return {
      userInfo: {},
      navData: [],
      openKeys: ['1','2','3','4']
    };
  },
  created() {
    const t = this
    t.userInfo = getUserInfo()
    if(t.userInfo.role.id == 1){
      t.navData = menu.adminMenu
    }else if(t.userInfo.role.id == 3){
      if(t.userInfo.unittype == 1){
        t.navData = menu.workerMenu
      }else{
        t.navData = menu.workerMenu.map((i)=>{
          if(i.Children.find(item=>item.MenuTitle == '常规群发')){
            i.Children = i.Children.filter(j=>j.MenuTitle !== '常规群发')
          }
          if(i.Children.find(item=>item.MenuTitle == '短信记录')){
            i.Children = i.Children.filter(j=>j.MenuTitle !== '短信记录')
          }
          if(i.Children.find(item=>item.MenuTitle == '原通讯录')){
            i.Children = i.Children.filter(j=>j.MenuTitle !== '原通讯录')
          }
          return i
        })
      }
    }else{
      t.navData = menu.leaderMenu
    }
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
