<template>
	<div>
		<a-layout id="components-layout-demo-custom-trigger" :style="{ height: '100vh' }">
			<a-layout-sider v-model="collapsed" :trigger="null" collapsible>
				<div class="logo">{{ collapsed ? collapsed : '预警响应系统' }}</div>
				<menuSider />
			</a-layout-sider>
			<a-layout>
				<a-layout-header style="background: #fff; padding: 0">
					<a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"
						@click="() => (collapsed = !collapsed)"/>
					<a-dropdown>
						<a class="ant-dropdown-link" @click="e => e.preventDefault()">
							您好，{{userInfo.realName}} <a-icon type="down"/>
						</a>
						<a-menu slot="overlay">
							<a-menu-item>
								<a href="javascript:;" @click="editPwd">修改密码</a>
							</a-menu-item>
							<a-menu-item>
								<a href="javascript:;" @click="backHome">回到首页</a>
							</a-menu-item>
							<a-menu-item>
								<a @click="logout">退出登录</a>
							</a-menu-item>
						</a-menu>
					</a-dropdown>
				</a-layout-header>
				<TabsHeader :pageList="pageList" :activePage="activePage" @change="changePage" @close="remove" />
				<a-layout-content :style="{
          margin: '15px 16px 24px 16px',
        }">
					<!-- Content -->
					<router-view ref="tabContent"></router-view>
					<div style="height: 30px;text-align: center;line-height: 30px">
            技术支持：中国科学院
          </div>
				</a-layout-content>
			</a-layout>

		</a-layout>
    <pwd-mod ref="pwdMod"></pwd-mod>
<!--		<center style="textAlign: center;margin-left: 5%;margin-top:50px;">-->
<!--			技术支持：中国科学院-->
<!--		</center>-->
	</div>
</template>

<script>
	import menuSider from "@/layout/menuSider";
	import TabsHeader from '@/components/TabsHeader';
  import pwdMod from "@/views/Admin/components/pwdMod";
  import { loginOut, getDistrictInfo } from "@/api/login";
  import { Session, getUserInfo} from '@/util/storage';
  import Cookies from "js-cookie";
	export default {
		name: "Home",
		data() {
			return {
        userInfo: {},
				collapsed: false, //返回logo图片或表述
				pageList: [],
				activePage: '',
				multiPage: 24
			};
		},
		components: {
			menuSider,
			TabsHeader,
      pwdMod
		},
		created() {
      this.userInfo = getUserInfo()
      // this.getDistrictInfo()
			const route = this.$route
			if (this.pageList.findIndex(item => item.path === route.path) === -1) {
				this.pageList.push(this.createPage(route))
			}
			this.activePage = route.path
			if (this.multiPage) {
				this.$nextTick(() => {
					this.setCachedKey(route)
				})
				this.addListener()
			}
		},
		watch: {
			'$route': function(newRoute) {
				this.activePage = newRoute.path
				const page = this.pageList.find(item => item.path === newRoute.path)
				if (!this.multiPage) {
					this.pageList = [this.createPage(newRoute)]
				} else if (page) {
					page.fullPath = newRoute.fullPath
				} else if (!page) {
					this.pageList.push(this.createPage(newRoute))
				}
				if (this.multiPage) {
					this.$nextTick(() => {
						this.setCachedKey(newRoute)
					})
				}
			}
		},
		methods: {
      backHome(){
        this.$router.push('/home')
      },

      editPwd(){
        const t = this
        t.$refs.pwdMod.updateType = 1
        t.$refs.pwdMod.form.uid = t.userInfo.uid
        t.$refs.pwdMod.visible = true
      },

			logout(){
        const t = this
        this.$confirm({
          title: '提示',
          content: h => <div>该操作将登出，是否继续？</div>,
          cancelText: '取消',
          okText: '确认',
          centered: true,
          async onOk() {
            const res = await loginOut()
            if (res.data.code === 100) {
              Session.clear(); // 清除缓存/token等
              // 使用 reload 时，不需要调用 resetRoute() 重置路由
              t.$router.push('/')
              // window.location.reload();
            } else {
              this.$message.warning(res.data.msg);
            }
          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test',
        });
			},

      // async getDistrictInfo(){
      //   let res = await getDistrictInfo()
      //   if(res.data.code == 100){
      //     console.log(res.data.data)
      //     Cookies.set('district', res.data.data);
      //     console.log(Cookies.get('district'),666)
      //   } else {
      //     this.$message.warning(res.data.msg);
      //   }
      // },

			changePage(key) {
				this.activePage = key
				const page = this.pageList.find(item => item.path === key)
				this.$router.push(page.fullPath)
			},
			remove(key, next) {
				if (this.pageList.length === 1) {
					return;
				}
				//清除缓存
				let index = this.pageList.findIndex(item => item.path === key)
				this.clearCaches = this.pageList.splice(index, 1).map(page => page.cachedKey)
				if (next) {
					this.$router.push(next)
				} else if (key === this.activePage) {
					index = index >= this.pageList.length ? this.pageList.length - 1 : index
					this.activePage = this.pageList[index].path
					this.$router.push(this.activePage)
				}
			},
			createPage(route) {
				return {
					keyPath: route.matched[route.matched.length - 1].path,
					fullPath: route.fullPath,
					loading: false,
					path: route.path,
					title: route.meta && route.meta.title,
					unclose: route.meta && route.meta.page && (route.meta.page.closable === false),
				}
			},
			/**
			 * 设置页面缓存的key
			 * @param route 页面对应的路由
			 */
			setCachedKey(route) {
				const page = this.pageList.find(item => item.path === route.path)
				page.unclose = route.meta && route.meta.page && (route.meta.page.closable === false)
				if (!page._init_) {
					const vnode = this.$refs.tabContent.$vnode
					page.cachedKey = vnode.key + vnode.componentOptions.Ctor.cid
					page._init_ = true
				}
			},
			/**
			 * 添加监听器
			 */
			addListener() {
				window.addEventListener('page:close', this.closePageListener)
			},
			/**
			 * 移出监听器
			 */
			removeListener() {
				window.removeEventListener('page:close', this.closePageListener)
			},
			closePageListener(event) {
				const {
					closeRoute,
					nextRoute
				} = event.detail
				const closePath = typeof closeRoute === 'string' ? closeRoute : closeRoute.path
				const path = closePath && closePath.split('?')[0]
				this.remove(path, nextRoute)
			},
		}
	};
</script>

<style lang="less" scoped>
	#components-layout-demo-custom-trigger .trigger {
		font-size: 18px;
		line-height: 64px;
		padding: 0 24px;
		cursor: pointer;
		transition: color 0.3s;
	}

	#components-layout-demo-custom-trigger .trigger:hover {
		color: #1890ff;
	}

	.logo {
		height: 36px;
		background: rgba(255, 255, 255, 0.2);
		margin: 16px;
		color: #faad14;
		text-align: center;
		line-height: 36px;
		font-size: 22px;
		text-shadow: 0 0 1px #000,
	}

	.ant-dropdown-link {
		float: right;
		margin-right: 25px;
	}
</style>