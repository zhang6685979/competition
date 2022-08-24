<template>
  <div class="header" :class="{black:$route.path=='/'}">
    <img :src="require('../assets/images/logo.png')" />
    <div class="nav-warp">
      <ul class="nav">
        <li :class="$route.path=='/'?'active':''"><a @click="goto('/')">首页</a></li>
        <li :class="$route.path.indexOf('/news')==1?'active':''"><a @click="goto('/news')">新闻资讯</a></li>
        <li :class="$route.path.indexOf('/notice')!=-1?'active':''"><a @click="goto('/notice')">通知公告</a></li>
        <li :class="$route.path.indexOf('/competition')!=-1?'active':''"><a @click="goto('/competitions')">大赛专区</a>
        </li>
        <li :class="$route.path=='/certificate'?'active':''"><a @click="goto('/certificate')">技能认证</a></li>
        <li :class="$route.path=='/examination'?'active':''"><a @click="goto('/examination')">考试专区</a></li>
        <li :class="$route.path=='/suggestion'?'active':''"><a @click="goto('/suggestion')">沟通与建议</a></li>
      </ul>
    </div>
    <div class="siteNav">
      <template v-if="!memberName">
        <a @click="goto('/login')">登录</a>
        <a @click="goto('/register')">账号申请</a>
      </template>
      <template v-else>
        <a><i class="el-icon-user-solid"> </i>{{memberName}}</a><a @click="logout">退出</a>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1'
      }
    },
    methods: {
      goto(path) {
        this.$router.push(path);
      },
      logout(){
        this.$store.commit('user/updateMember',{})
        localStorage.removeItem('member');
      }
    },
    computed: {
      memberName: {
        get() {
          return this.$store.state.user.memberName
        }
      }
    }
  }
</script>

<style scoped="">
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    border: none;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
  }

  .header img {
    max-height: 90px;
  }

  .header .nav-warp {
    flex: 1;
  }

  .header .nav-warp .nav {
    max-width: 800px;
    margin: auto;
  }

  .header .nav-warp .nav li {
    float: left;
    list-style: none;
  }

  .header .nav-warp .nav li a {
    display: block;
    padding: 0 20px;
    line-height: 90px;
    color: #555;
    text-decoration: none;
    font-size: 16px;
  }

  .header .nav-warp .nav li.active a,
  .header .nav-warp .nav li a:hover {
    color: #e91b23 !important;
  }

  .siteNav {
    margin-left: 5px;
    display: table-cell;
    vertical-align: middle;
    line-height: 90px;
    float: right;
    margin-right: 40px;
  }

  .header .siteNav a {
    line-height: 26px;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    margin-right: 5px;
    color: #333;
  }

  .header .siteNav a:last-child {
    color: #fff !important;
    background: #cf0a2c;
    margin-right: 0;
  }

  .header.black {
    background: rgba(0, 0, 0, .4) !important;
  }

  .header.black a {
    color: #fff !important;
  }
</style>
