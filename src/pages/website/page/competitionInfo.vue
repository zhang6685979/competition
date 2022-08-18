<template>
  <div class="container">
    <img :src="inputForm.banner" alt="" class="banner">
    <div class="nav">
      <ul>
        <li><a href="">参赛报名</a></li>
        <li><a href="">赛事风采</a></li>
        <li><a href="">赛事新闻</a></li>
        <li><a href="">赛事直播</a></li>
        <li><a href="">成绩查询</a></li>
        <li><a href="">大赛设备</a></li>
        <li><a href="">通知公告</a></li>
        <li><a href="">资源下载</a></li>
      </ul>
    </div>
    <el-card class="box-card">
      <el-row class="mt-30 mb-30" :gutter="20">
        <el-col :span="12">
          <el-carousel height="320px" :autoplay="false">
            <el-carousel-item v-for="(item,index) in newsList.slice(0,5)" :key="index">
              <router-link :to="{path:'/news/'+item.id}"><img :src="item.image" class="image" /></router-link>
              <p class="carousel-title">{{item.title}}</p>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="12">
          <el-row class="item" :gutter="20" v-for="(item,index) in newsList" :key="index">
            <el-col :span="6">
              <router-link class="thumbnail" :to="{path:'/news/'+item.id}">
                <img :src="item.image">
              </router-link>
            </el-col>
            <el-col :span="18">
              <div class="item-heading">
                <div class="text-muted pull-right">
                  <span>
                    <i class="el-icon-time"></i> {{item.updateDate.substring(0,10)}}</span>
                </div>
                <router-link :to="{path:'/news/'+item.id}">{{item.title}}</router-link>
              </div>
              <p class="item-content">
                {{item.describe0}}
              </p>
            </el-col>
          </el-row>
          <a class="pull-right">查看更多>></a>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="card card1">
            <img :src="require('../assets/images/csbm.png')" alt="">
            <p>参赛报名</p>
          </div>

        </el-col>
        <el-col :span="6">
          <div class="card card2">
            <img :src="require('../assets/images/cjcx.png')" alt="">
            <p>成绩查询</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card card3">
            <img :src="require('../assets/images/jssb.png')" alt="">
            <p>竞赛设备</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card card4">
            <img :src="require('../assets/images/tzgg.png')" alt="">
            <p>通知公告</p>
          </div>
        </el-col>
      </el-row>
       <p class="title">赛事风采 <sub>Competition Zone</sub></p>
       <el-row :gutter="15" class="mt-20">
         <el-col :span="6" v-for="(item, index) in styleList" :key="index">
           <el-card :body-style="{ padding: '0px','margin-bottom':'15px' }" shadow="never">
             <img :src="item.image" class="competition-image">
             <div class="desc">
               {{item.describe0}}
             </div>
           </el-card>
         </el-col>
       </el-row>
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
        cid:cid,
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          banner: '',
          describe0: ''
        },
        newsList: [],
        styleList:[]//赛事风采
      }
    },

    mounted() {
      this.queryById();
      this.getNewsList();
      this.getStyleList();
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
      getNewsList() {
        this.$http({
          url: '/news/news/public/list',
          method: 'get',
          params: {
            'current': 1,
            'size': 3,
            'cid': this.cid
          }
        }).then(({
          data
        }) => {
          this.newsList = data.records
        })
      },
      getStyleList(){
        this.$http({
          url: '/competition/competitionStyle/public/list',
          method: 'get',
          params: {
            'current': 1,
            'size': 999,
            'cid': this.cid
          }
        }).then(({
          data
        }) => {
          this.styleList = data.records
        })
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
        margin: 0 auto;
        align-items: center;
        justify-content: center;

        li {
          position: relative;

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
            padding: 0 30px;
            display: inline-block;
            color: #303133;
            font-size: 18px;
            height: 80px;
            line-height: 80px;
          }
        }
      }
    }

    .box-card {
      width: 80%;
      margin: 0 auto;

      .image {
        width: 100%;
        height: 100%;
      }

      .item {
        margin-bottom: 20px;

        .thumbnail {
          display: block;
          width: 100%;
          height: 83px;

          img {
            width: 100%;
            height: 100%
          }

        }

        .item-heading {
          a {
            font-size: 18px;
            font-weight: bold;
            color: #303133;
            width: 70%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          }

          .text-muted {
            float: right;
            colot: #707070;
            font-size: 16px;
          }
        }

        .item-content {
          font-size: 14px;
          color: #707070;
          line-height: 23px;
          height: 42px;
          overflow: hidden;
        }
      }

      .card {
        background: red;
        text-align: center;
        color: #fff;
        width: 80%;
        margin: 0 auto;
        padding: 30px 0;
      }
      .card1{
        background-color: #F27E00;
      }
      .card2{
        background-color: #004093;
      }
      .card3{
        background-color: #53955E;
      }
      .card4{
        background-color: #ED6B00;
      }
      .title {
        font-size: 22px;
        line-height: 22px;
        font-weight: bold;
        border-left: 5px solid #E50006;
        padding-left: 10px;
        margin-bottom: 15px;
        margin-top: 30px;
        sub {
          font-size: 13px;
          color: #898b8c;
          vertical-align: text-bottom;
        }
      }
      .competition-image {
        width: 100%;
        height: 156px;
      }

      .desc {
        padding: 14px;
        background-color: #EBEBEB;
        position: relative;
        font-size: 14px;
        height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

    }

  }

</style>
