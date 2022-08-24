<template>
  <div class="index-warp">
    <el-backtop :bottom="60"></el-backtop>
    <el-carousel :interval="5000" height="560px">
      <el-carousel-item v-for="(item,index) in carouselList" :key="index">
        <a :href="item.url" target="_blank"><img :src="item.image" class="image" /></a>
      </el-carousel-item>
    </el-carousel>
    <div class="cont-warp">
      <el-row class="mt-30 mb-30" :gutter="20">
        <el-col :span="12">
          <el-carousel height="250px" indicator-position="none">
            <el-carousel-item v-for="(item,index) in newsList.slice(0,5)" :key="index">
              <router-link :to="{path:'/news/'+item.id}"><img :src="item.image" class="image" /></router-link>
              <p class="carousel-title">{{item.title}}</p>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="12">
          <div class="mytabs">
            <ul>
              <li :class="{active:activeIndex==0}" @click="activeIndex=0">新闻动态</li>
              <li :class="{active:activeIndex==1}" @click="activeIndex=1">通知公告</li>
            </ul>
            <div class="border" :style="{left:activeIndex==0?'25px':'110px'}"></div>
            <button class="more" @click="$router.push(activeIndex==0?'/news':'/notice')">更多+</button>
          </div>
          <div class="tab-content">
            <div class="news-list" v-show="activeIndex==0">
              <div class="news-item" v-for="(item,index) in newsList.slice(0,5)">
                <div class="news-title">
                  <router-link :to="{path:'/news/'+item.id}"><span class="circle"></span>{{item.title}}</router-link>
                </div>
                <div class="news-status">
                  <span type="danger" v-if="item.latest=='1'">new</span>
                  <p>{{item.updateDate&&item.updateDate.substring(0,10)}}</p>
                </div>
              </div>
            </div>
            <div class="news-list" v-show="activeIndex==1">
              <div class="news-item" v-for="(item,index) in announcementList.slice(0,5)">
                <div class="news-title">
                  <router-link :to="{path:'/notice/'+item.id}"><span class="circle"></span>{{item.title}}</router-link>
                </div>
                <div class="news-status">
                  <span type="danger" v-if="item.latest=='1'">new</span>
                  <p>{{item.updateDate&&item.updateDate.substring(0,10)}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <p class="title">大赛专区 <sub>Competition Area</sub></p>
      <div class="competition">
        <div class="clearfix">
          <ul>
            <li v-for="item in $dictUtils.getDictList('jab_new_type')" :class="{active:item.value==type}"
              :key="item.value" :label="item.label" @click="getCompetitionList(item.value)">{{item.label}}</li>
            <li @click="$router.push('/competitions')">更多.....</li>
          </ul>
        </div>
        <!-- <el-row :gutter="15" class="mt-20">
          <el-col :span="6" v-for="(item, index) in competitionList.slice(0,4)" :key="index">
            <el-card :body-style="{ padding: '0px' }" shadow="never">
              <img :src="item.image" class="competition-image">
              <div class="desc">
                {{item.describe0}}
              </div>
            </el-card>
          </el-col>
        </el-row> -->

        <div class="recommendPage mt-20">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) in competitionList" :key="index">
              <el-card :body-style="{ padding: '0px' }" shadow="never">
                <img :src="item.image" class="competition-image">
                <div class="desc">
                  {{item.describe0}}
                </div>
              </el-card>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>

        </div>
      </div>
      <p class="title">技能认证 <sub>Skill Certification</sub></p>
      <div class="clearfix competition">
        <ul>
          <li>车辆维修与保养证书</li>
          <li @click="$router.push('/certificate')">更多.....</li>
        </ul>
      </div>
      <el-row :gutter="10" class="competition">
        <el-col :span="12" v-for="(item, index) in certificateList.slice(0,2)" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="item.image" class="certificate-image">
          </el-card>
        </el-col>
      </el-row>
      <p class="title">考试专区 <sub>Examination Area</sub></p>
      <div class="clearfix competition">
        <ul>
          <li>理论考核平台</li>
          <li>实训竞赛平台</li>
          <li @click="$router.push('/examination')">更多.....</li>
        </ul>
      </div>
      <el-row :gutter="10" class="competition">
        <el-col :span="8" v-for="(item, index) in platformList.slice(0,3)" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <a :href="item.url" target="_blank"><img :src="item.image" class="platform-image"></a>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  // Import Swiper Vue.js components
  // import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue.js';

  // Import Swiper styles
  //import 'swiper/swiper.min.css';
  // 引入插件
  import {
    Swiper,
    SwiperSlide
  } from "vue-awesome-swiper";
  import "swiper/css/swiper.css";


  export default {
    data() {
      return {
        activeIndex: 0,
        newsList: [],
        carouselList: [],
        announcementList: [],
        competitionList: [],
        certificateList: [],
        platformList: [],
        type: '', //比赛分类
        swiperOption: {
          slidesPerView: 4,
          spaceBetween: 20,
          slidesPerGroup: 4,
          loop: true,
          // 显示分页
          pagination: {
            el: ".swiper-pagination",
            clickable: true //允许分页点击跳转
          },
          // 设置点击箭头
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }
        }
      }
    },
    components: {
      Swiper,
      SwiperSlide,
    },
    created() {
      this.getNewsList(); //新闻列表
      this.getCarouselList(); //轮播图列表
      this.getAnnouncementList(); //公告列表
      this.getCompetitionList();
      this.getCertificateList();
      this.getPlatformList();
    },
    methods: {
      getCarouselList() {
        this.$http({
          url: '/carousel/carousel/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.carouselList = data.records;
        })
      },
      getNewsList() {
        this.$http({
          url: '/news/news/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.newsList = data.records;
        })
      },
      getAnnouncementList() {
        this.$http({
          url: '/announcement/announcement/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.announcementList = data.records;
        })
      },
      getCompetitionList(type) {
        this.type = type;
        this.$http({
          url: '/competition/competition/public/list',
          method: 'get',
          params: {
            type: type
          }
        }).then(({
          data
        }) => {
          this.competitionList = data.records;
        })
      },
      getCertificateList() {
        this.$http({
          url: '/certificate/certificate/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.certificateList = data.records;
        })
      },
      getPlatformList() {
        this.$http({
          url: '/platform/platform/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.platformList = data.records;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index-warp {
    margin-top: -110px;
    background-color: #fff;

    .cont-warp {
      max-width: 1200px;
      margin: 0 auto;

      .carousel-title {
        position: absolute;
        width: 100%;
        height: 24px;
        padding-left: 15px;
        font-size: 14px;
        bottom: 0;
        background: rgb(26 19 17 / 50%);
        color: #ffffff;
      }
    }
  }



  .title {
    font-size: 22px;
    line-height: 22px;
    font-weight: bold;
    border-left: 5px solid #DC000C;
    padding-left: 10px;
    margin-bottom: 15px;
  }

  .title sub {
    font-size: 13px;
    color: #898b8c;
  }

  .competition {
    padding: 0 15px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .competition ul li {
    float: left;
    display: block;
    padding: 0 10px;
    border-right: 1px solid #1A1718;
    cursor: pointer;
    font-size: 12px;

    &.active {
      color: #DC000C
    }
  }

  .competition ul li:first-child {
    padding-left: 0;
  }

  .competition ul li:last-child {
    color: #DC000C;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .competition-image {
    width: 100%;
    height: 156px;
  }

  .desc {
    padding: 10px;
    background-color: #E0E1E4;
    position: relative;
    font-size: 14px;
    height: 75px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .desc:after {
    content: "";
    display: block;
    width: 64px;
    height: 5px;
    background-color: #DC000C;
    position: absolute;
    top: 0;
    left: 15px;
  }

  .mytabs {
    position: relative;
    border-bottom: 1px solid #DC000C;
    height: 30px;
  }

  .mytabs .more {
    border: none;
    background: #DC000C;
    border-radius: 5px;
    padding: 3px 7px;
    color: #fff;
    float: right;
    font-size: 12px;
    cursor: pointer;
  }

  .mytabs li {
    display: block;
    float: left;
    padding-right: 20px;
    color: #1A1718;
    cursor: pointer;
    font-size: 18px;
  }

  .mytabs li:hover,
  .mytabs li.active {
    color: #DC000C;
  }


  .border {
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 25px;
  }

  .border::before {
    content: '';
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 0;
    border-top: 6px solid #DC000C;
    position: absolute;
    top: 0;
    left: 0;
  }

  .border:after {
    content: '';
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 0;
    border-top: 6px solid #fff;
    position: absolute;
    top: -1px;
    left: 0px;
  }

  .news-list .news-item {
    margin: 10px 0;
    height: 30px;
  }

  .news-list .news-item .news-title {
    flex: 1;
    align-items: center;
    display: flex;
    padding-right: 15px;
    line-height: 24px;
  }

  .news-list .news-item .news-title .circle {
    width: 8px;
    height: 8px;
    background-color: #DC000C;
    border-radius: 50%;
    vertical-align: middle;
    padding: 0;
    margin-right: 10px;
  }

  .news-list .news-item .news-status {
    width: 75px;
    font-size: 12px;
  }

  .news-list .news-item .news-title a {
    overflow: hidden;

    text-overflow: ellipsis;

    display: -webkit-box;

    -webkit-box-orient: vertical;

    -webkit-line-clamp: 2;
    color: #242222;
  }

  .news-item {
    display: flex;
  }

  .news-list .news-item span {
    display: inline-block;
    border-radius: 5px;
    background-color: #DC000C;
    color: #fff;
    padding: 0 5px;
    text-align: center;
  }

  .certificate-image {
    width: 100%;
    height: 112px;
  }

  .platform-image {
    width: 100%;
    height: 170px;
  }

  .el-backtop {
    color: #DC000C;
  }
</style>
