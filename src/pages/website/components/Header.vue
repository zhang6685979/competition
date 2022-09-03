<template>
  <div class="header" :class="{black:transparent}">
    <img :src="banners.weblogo" />
    <div class="nav-warp">
      <ul class="nav">
        <li :class="$route.path=='/'?'active':''"><a @click="goto('/')">首页</a></li>
        <li :class="$route.path.indexOf('/news')==0?'active':''"><a @click="goto('/news')">新闻资讯</a></li>
        <li :class="$route.path.indexOf('/notice')==0?'active':''"><a @click="goto('/notice')">通知公告</a></li>
        <li :class="$route.path.indexOf('/competition')!=-1?'active':''">
          <a @click="goto('/competitions')">大赛专区</a>
          <ul class="dropdown-menu">
            <li v-for="(item,index) in competitionList" :class="$route.params.id==item.id?'active':''">
              <router-link :to="'/competitions/'+item.id">{{item.title}}</router-link>
            </li>
          </ul>
        </li>
        <li :class="$route.path=='/certificate'?'active':''"><a @click="goto('/certificate')">技能认证</a></li>
        <li :class="$route.path=='/examination'?'active':''"><a @click="goto('/examination')">考试专区</a>
          <ul class="dropdown-menu">
            <li v-for="(item,index) in platformList"><a :href="item.url" target="_blank">{{item.title}}</a></li>
          </ul>
        </li>
        <li :class="$route.path=='/suggestion'?'active':''"><a @click="goto('/suggestion')">沟通与建议</a></li>
      </ul>
    </div>
    <div class="siteNav">
      <el-input placeholder="请输入关键字" class="search-input" v-model="keyword" clearable @keyup.enter.native="toSearch()">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="toSearch()"></i>
      </el-input>
      <template v-if="!memberName">
        <a @click="goto('/login')"><i class="el-icon-user-solid"> </i> 登录</a>
        <!-- <a @click="goto('/register')">账号申请</a> -->
      </template>
      <template v-else>
        <a><i class="el-icon-user-solid"> </i>&nbsp;{{memberName}}</a><a @click="logout">退出</a>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        competitionList: [],
        platformList: [],
        keyword: '',
        transparent:false
      }
    },
    watch:{
      '$route.path':function(newVal){
        if(newVal=='/'){
           window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
           this.transparent = true;
        }else{
           window.removeEventListener('scroll', this.handleScroll)
           this.transparent = false;
        }
      }
    },
    mounted() {
      this.keyword = this.$route.query.keyword;
      this.getCompetitionList();
      this.getPlatformList();
      if(this.$route.path=='/'){
         window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
         this.transparent = true;
      }else{
         window.removeEventListener('scroll', this.handleScroll)
         this.transparent = false;
      }
    },
    methods: {
      // 获取页面滚动距离
      handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop>760){
          this.transparent = false;
        }else{
          this.transparent = true;
        }
      },
      goto(path) {
        this.$router.push(path);
      },
      logout() {
        this.$store.commit('user/updateMember', {})
        localStorage.removeItem('member');
      },
      getCompetitionList(type) {
        this.type = type;
        this.$http({
          url: '/competition/competition/public/list',
          method: 'get',
          params: {
            type: type,
            current: 1,
            size: 999
          }
        }).then(({
          data
        }) => {
          this.competitionList = data.records;
        })
      },
      getPlatformList() {
        this.$http({
          url: '/platform/platform/public/list',
          method: 'get',
          params: {
            current: 1,
            size: 999
          }
        }).then(({
          data
        }) => {
          this.platformList = data.records;
        })
      },
      toSearch() {
        var keyword = this.keyword;
        if (keyword) {
          this.$router.push('/search?keyword=' + keyword);
        } else {
          this.$message.warning('请输入您要搜索的关键字!');
        }
      }
    },
    computed: {
      memberName: {
        get() {
          return this.$store.state.user.memberName
        }
      },
      banners: {
        get() {
          return this.$store.state.config.banners
        }
      }
    }
  }
</script>

<style lang="scss">
  .header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    border: none;
    display: flex;
    padding: 0 290px;
    align-items: center;
    background: #303133;
    transition: background 0.5s linear;
  }

  .header img {
    width: 180px;
    height: 50px;
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
    position: relative;

    a {
      display: block;
      padding: 0 20px;
      line-height: 90px;
      color: #fff;
      text-decoration: none;
      font-size: 16px;
    }

    &:hover .dropdown-menu {
      display: block;
    }

    .dropdown-menu {
      width: 160px;
      position: absolute;
      left: 50%;
      margin-left: -80px;
      top: 100%;
      background-color: #303133;
      display: none;

      li {
        float: none;

        a {
          line-height: 40px;
          white-space: nowrap;
          font-size: 13px;
          color: #fff !important;
          text-align: center;

          &:hover {
            color: #e91b23 !important;
          }
        }

        &.active a {
          color: #e91b23 !important;
        }
      }
    }
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
    color: #fff;
  }

  .header .siteNav a:last-child {
    color: #fff !important;
    margin-right: 0;
  }

  .header.black {
    background: none;
  }

  .header.black .dropdown-menu {
    background: rgba(255, 255, 255, .7) !important;
  }

  .header.black a {
    color: #fff !important;
  }

  .header .search-input {
    width: 220px;
    height: 36px;
  }
</style>
