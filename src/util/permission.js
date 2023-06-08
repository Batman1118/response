import router from '@/router/index';
import Cookies from "js-cookie";
import {message} from "ant-design-vue";
// 这里就可以进行vue-router的beforeEach拦截了，你也可以放其他地方，我比较喜欢放这
router.beforeEach((to, from, next) => {
    // 这里先获取下用户信息，我偷懒用sessionStorage存了
    // 里面包含了用户权限，用户各种信息等
    const token = Cookies.get('resTk')
    // 这里必须加上to.path !== 'login'的判断，不然会陷入无限循环，
    // 因为逻辑是第一次进来，判断用户信息不存在，即!user为true，由于使用的是next('/login')而非next()，
    // 会再次进入路由跳转，next()方法没有参数是直接进入页面，不会再次进入路由拦截，有参数则会，因为跳转，
    // 所以再次进入路由，再次判断，再次进入路由，再次判断，循环往复无限循环
    // 所以一定要加to.path !== 'login'的判断
    if (!token && to.path !== '/') {
        message.error('用户信息已过期，请重新登录');
        next('/');
    }else {
        next();
    }
});