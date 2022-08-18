<template>
  <div class="container">
    <img :src="inputForm.banner" alt="" class="banner">
    <div class="nav">
      <ul>
        <li><a :class="{active:$route.path.indexOf('signup')!=-1}" @click="goto('signup')">参赛报名</a></li>
        <li><a :class="{active:$route.path.indexOf('style')!=-1}" @click="goto('style')">赛事风采</a></li>
        <li><a :class="{active:$route.path.indexOf('news')!=-1}" @click="goto('news')">赛事新闻</a></li>
        <li><a :class="{active:$route.path.indexOf('live')!=-1}" @click="goto('live')">赛事直播</a></li>
        <li><a :class="{active:$route.path.indexOf('queryScore')!=-1}" @click="goto('queryScore')">成绩查询</a></li>
        <li><a :class="{active:$route.path.indexOf('device')!=-1}" @click="goto('device')">大赛设备</a></li>
        <li><a :class="{active:$route.path.indexOf('notice')!=-1}" @click="goto('notice')">通知公告</a></li>
        <li><a :class="{active:$route.path.indexOf('download')!=-1}" @click="goto('download')">资源下载</a></li>
      </ul>
    </div>
    <el-card class="box-card">
       <router-view></router-view>
    </el-card>

  </div>
</template>

<script>
  export default {
    props: {
      id: String
    },
    data() {
      var cid = this.$route.params.id;
      return {
        cid: cid,
        page:'',
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          banner: '',
          describe0: ''
        },
      }
    },

    mounted() {
      this.queryById();
    },
    methods: {
      queryById() {
        this.$http({
          url: '/competition/competition/public/queryById',
          method: 'get',
          params: {
            id: this.cid
          }
        }).then(({
          data
        }) => {
          this.inputForm = data;
        })
      },
      goto(page){
        this.page = page;
        this.$router.push('/competition/'+this.cid+'/'+page);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    margin-top: -20px;

    .pull-right {
      float: right;
    }

    .banner {
      width: 100%;
      height: 330px;
    }

    .nav {
      height: 80px;
      background-color: #fff;

      ul {
        display: flex;
        width: 80%;
        margin: 0 auto;
        align-items: center;
        justify-content: center;

        li {
          position: relative;
          flex: 1;

          &:before,
          &:last-child:after {
            content: "";
            display: block;
            width: 2px;
            height: 21px;
            background-color: #303133;
            position: absolute;
            left: 0;
            top: 30px;
          }

          &:last-child:after {
            left: auto;
            right: 0;
          }

          a {
            display: inline-block;
            color: #303133;
            font-size: 18px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            width: 100%;
            &:hover,&.active{color:#DC000C;}
          }
        }
      }
    }

    .box-card {
      width: 80%;
      margin: 0 auto;
    }

  }
</style>
