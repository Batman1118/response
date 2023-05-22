import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './util/AntDesign'
import 'ant-design-vue/dist/antd.css'
import moment from 'moment'
//设置组件默认中文
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

Vue.config.productionTip = false

Vue.filter('filterTime', (value) => {
  moment.locale('zh-cn') // 使用中文
  // 判断当前日期是否是7天之前
  if (moment(value).isBefore(moment().subtract(7, 'days'))) {
    return moment(value).format('YYYY-MM-DD')
  } else {
    // 1小时前
    return moment(value).from(moment())
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
