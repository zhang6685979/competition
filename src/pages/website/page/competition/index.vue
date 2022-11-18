<template>
  <div>
    <div class="news-warp">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-carousel class="carouse" indicator-position="none">
            <el-carousel-item v-for="(item,index) in newsList.slice(0,5)" :key="index">
              <router-link :to="{path:'/news/'+item.id}"><img :src="item.image" class="image" /></router-link>
              <p class="carousel-title">{{item.title}}</p>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="12">
          <div class="item" :gutter="20" v-for="(item,index) in newsList" :key="index">
            <router-link :to="{path:'/news/'+item.id}">{{item.title}}</router-link>
            <span>{{item.updateDate.substring(0,10)}}</span>
          </div>
          <!-- <a class="pull-right" @click="$router.push('/competition/'+cid+'/news')">查看更多>></a> -->
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" class="func-warp">
      <el-col :span="6">
        <div class="card card1" @click="$router.push('/competition/'+cid+'/signup')">
          <img :src="require('../../assets/images/xxtb.png')" alt="">
          <p>信息填报</p>
        </div>

      </el-col>
      <el-col :span="6">
        <div class="card card2" @click="$router.push('/competition/'+cid+'/queryScore')">
          <img :src="require('../../assets/images/cjcx.png')" alt="">
          <p>成绩查询</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card card3" @click="$router.push('/competition/'+cid+'/device')">
          <img :src="require('../../assets/images/jssb.png')" alt="">
          <p>竞赛设备</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card card4" @click="$router.push('/competition/'+cid+'/notice')">
          <img :src="require('../../assets/images/tzgg.png')" alt="">
          <p>通知公告</p>
        </div>
      </el-col>
    </el-row>
    <div class="style-warp">
      <h5 class="title">
        赛事风采
      </h5>
      <img class="line" :src="require('../../assets/images/line.png')" alt="">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in styleList" :key="index">
          <div class="style-card">
            <img :src="item.image" class="competition-image">
            <div class="desc">
              {{item.describe0}}
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
  // 引入插件
  import {
    Swiper,
    SwiperSlide
  } from "vue-awesome-swiper";
  import "swiper/css/swiper.css";
  import CompetitionStyle from './style'
  export default {
    data() {
      var cid = this.$route.params.id;
      return {
        cid: cid,
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          banner: '',
          describe0: ''
        },
        newsList: [],
        styleList: [],
        swiperOption: {
          slidesPerView: 3,
          slidesPerColumnFill: 'row',
          slidesPerColumn: 2,
          spaceBetween: 20,
          slidesPerGroup: 3,
          loop: false,
          speed: 4000, //匀速时间
          autoplay: {
            delay: 0,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          }

        }
      }
    },
    components: {
      CompetitionStyle,
      Swiper,
      SwiperSlide
    },
    watch: {
      '$route.params.id': {
        handler(newVal, oldVal) {
          this.cid = newVal;
          this.getNewsList();
          this.getStyles();
        },
        deep: true,
      }
    },
    mounted() {
      this.getNewsList();
      this.getStyles();
    },
    methods: {
      getNewsList() {
        var cid = this.$route.params.id;
        this.$http({
          url: '/news/news/public/list',
          method: 'get',
          params: {
            'current': 1,
            'size': 3,
            'cid': cid
          }
        }).then(({
          data
        }) => {
          this.newsList = data.records
        })
      },
      //获取赛事风采
      getStyles() {
        var cid = this.$route.params.id;
        this.$http({
          url: '/competition/competitionStyle/public/list',
          method: 'get',
          params: {
            'current': 1,
            'size': 999,
            'cid': cid
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
  .news-warp {
    width: 80%;
    margin: 30px auto;
    .carouse{width:700px;height: 400px;margin: 0 auto;}
    .carousel-title {
      position: absolute;
      bottom: 0;
      width: 100%;
      color: #fff;
      background: rgba(0, 0, 0, .4);
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
    }

    .image {
      width: 100%;
      height: 100%;
    }

    .item {
      position: relative;
      &:after {
        display: block;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #DC000C;
        left: 0;
        position: absolute;
        top: 8px;
      }

      a {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 24px;
        padding-left:15px;
      }

      span {
        color: #707070;
        line-height: 30px;
        padding-left:15px;
      }
    }
  }

  .func-warp {
    background: #27314F;
    padding: 80px 260px;

    .card {
      text-align: center;
      color: #fff;
      width: 328px;
      height: 240px;
      margin: 0 auto;
      padding: 60px 0;
      cursor: pointer;
      background: #fff;
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 8px 8px 8px 8px;
      font-size: 24px;
      font-weight: 400;
      color: #000000;
      line-height: 24px;

      img {
        width: 72px;
        height: 72px;
        margin-bottom: 8px;
      }
    }
  }

  .style-warp {
    margin: 80px 260px;
    text-align: center;

    .title {
      font-size: 32px;
      font-weight: normal;
      color: #000;
      line-height: 30px;
      margin-bottom: 20px;
    }

    .line {
      display: block;
      margin: 0 auto 80px;
    }

    .style-card {
      position: relative;
      width: 445px;
      height: 282px;
      margin: 0 auto 20px;

      .competition-image {
        width: 100%;
        height: 100%;
      }

      .desc {
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgb(220 0 12 / 40%);
        font-size: 20px;
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
      }
    }
  }
</style>
