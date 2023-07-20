import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login'),
	meta: { title: '登录' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/home',
        name: 'default',
        meta: { title: '控制面板' },
        component: () => import('@/views/Admin/HomeDefault'),
      },
	  {
	    path: '/wendy',
	    name: 'default',
	    meta: { title: '实时气象' },
	    component: () => import('@/views/Admin/Wendy'),
	  },
	  {
	    path: '/release',
	    name: 'release',
	    meta: { title: '本级发出' },
	    component: () => import('@/views/Admin/release'),
	  },
	  {
	    path: '/list',
	    name: 'list',
	    meta: { title: '我收到的' },
	    component: () => import('@/views/Admin/list'),
	  },
	  {
	    path: '/audit',
	    name: 'audit',
	    meta: { title: '数据统计' },
	    component: () => import('@/views/Admin/Audit'),
	  },
      {
        path: '/notice',
        name: 'notice',
        meta: { title: '信息编辑' },
        component: () => import('@/views/Admin/notice'),
      },
		{
			path: '/msgReview',
			name: 'msgReview',
			meta: { title: '信息审核' },
			component: () => import('@/views/Admin/msgReview'),
		},
	  {
	    path: '/report',
	    name: 'report',
	    meta: { title: '信息发布' },
	    component: () => import('@/views/Admin/Report'),
	  },
      {
        path: '/history',
        name: 'history',
        meta: { title: '历史信息' },
        component: () => import('@/views/Admin/history'),
      },
	  {
	    path: '/callRecord',
	    name: 'callRecord',
	    meta: { title: '叫应记录' },
	    component: () => import('@/views/Admin/callRecord'),
	  },
		{
			path: '/massSend',
			name: 'massSend',
			meta: { title: '常规群发' },
			component: () => import('@/views/Admin/massSend'),
		},
		{
			path: '/msgRecord',
			name: 'msgRecord',
			meta: { title: '短信记录' },
			component: () => import('@/views/Admin/msgRecord'),
		},
	  {
	    path: '/samelevel',
	    name: 'samelevel',
	    meta: { title: '平级接收人管理' },
	    component: () => import('@/views/Admin/sameLevel'),
	  },
		{
			path: '/addressBook',
			name: 'addressBook',
			meta: { title: '原通讯录' },
			component: () => import('@/views/Admin/addressBook'),
		},
      {
        path: '/user',
        name: 'user',
        meta: { title: '用户管理' },
        component: () => import('@/views/Admin/userManage'),
      },
		{
			path: '/smsSetting',
			name: 'smsSetting',
			meta: { title: '短信平台设置' },
			component: () => import('@/views/Admin/smsSetting'),
		},
		// {
		// 	path: '/menu',
		// 	name: 'menu',
		// 	meta: { title: '菜单管理' },
		// 	component: () => import('@/views/Admin/menuManage'),
		// },
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// 全局后置钩子
router.afterEach((to) => {
  // 设置title
  document.title = to.meta.title;
});

export default router;
