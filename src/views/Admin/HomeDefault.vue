<template>
  <div class="home-default">
    <div class="home-default-header">
      <h1>工作台</h1>
      <div class="content">
        <div class="content-left">
          <img src="./../../assets/user.png" alt="">
          <div class="user">
            <h2>{{ dateTime}}，{{userName}}，欢迎使用自治区自然灾害综合风险预警发布及响应联动系统</h2>
            <p>自治区预警中心干部  工作人员</p>
          </div>
        </div>
        <div class="content-right">
          <div class="item">
            <p>本月通知数</p>
            <span>646</span>
          </div>
          <a-divider type="vertical" style="height: 100%; margin: 0px 16px"/>
          <div class="item">
            <p>叫应数</p>
            <span>568</span>
          </div>
          <a-divider type="vertical" style="height: 100%; margin: 0px 16px"/>
          <div class="item">
            <p>叫应率</p>
            <span>88%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="home-default-content">
      <div class="left">
        <Projecting />
        <Dynamic style="margin-top: 20px"/>
      </div>
      <div class="right">
        <QuickNavigation />
        <IndexEcharts style="margin-top: 20px"/>
        <Team style="margin-top: 20px"/>
      </div>
    </div>
  </div>
</template>

<script>
import Projecting from '@/components/Home/Projecting'
import Dynamic from '@/components/Home/Dynamic'
import QuickNavigation from '@/components/Home/QuickNavigation'
import IndexEcharts from '@/components/Home/IndexEcharts'
import Team from '@/components/Home/Team'
import Cookies from "js-cookie";

export default {
  name: 'home-default',
  components: {
    Projecting,
    Dynamic,
    QuickNavigation,
    IndexEcharts,
    Team
  },
  data() {
    return {
      userName: ''
    };
  },
  created() {
    this.userName = JSON.parse(Cookies.get('userInfo')).realName
  },
  computed: {
    dateTime () {
      let date = new Date()
      if (date.getHours() >= 0 && date.getHours() < 12) {
        return '上午好'
      } else if (date.getHours() >= 12 && date.getHours() < 18) {
        return '下午好'
      } else {
        return '晚上好'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-default {
  .home-default-header {
    background-color: #fff;
    padding: 24px;
    h1 {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      .content-left {
        display: flex;
        img {
          width: 64px;
          height: 64px;
          margin-right: 20px;
        }
        .user {
          p {
            margin-bottom: 0px;
          }
        }
      }
      .content-right {
        display: flex;
        .item {
          text-align: center;
        }
      }
    }
  }
  .home-default-content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .left {
      width: 66%;
    }
    .right {
      width: 33%;
    }
  }
}
</style>