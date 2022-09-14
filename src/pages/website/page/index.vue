<template>
  <div class="index-warp">
    <el-backtop :bottom="60"></el-backtop>
    <el-carousel :interval="5000" class="carousel">
      <el-carousel-item v-for="(item,index) in carouselList" :key="index">
        <a :href="item.url" target="_blank"><img :src="item.image" class="image" /></a>
      </el-carousel-item>
    </el-carousel>
    <div class="news-warp">

      <el-tabs v-model="activeIndex" class="my-tab">
        <el-tab-pane label="新闻动态" name="0">
          <span slot="label" class="tab-title">新闻动态</span>
          <div class="news-list">
            <div class="news-item" v-for="(item,index) in newsList.slice(0,3)">
              <div class="news-left">
                <img :src="item.image" alt="">
              </div>
              <div class="news-right">
                <h5 @click="$router.push('/news/'+item.id)">{{item.title}} <span class="tag"
                    v-if="item.latest=='1'">new</span></h5>
                <p>{{item.describe0}}</p>
                <span>{{item.updateDate&&item.updateDate.substring(0,10)}}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="通知公告" name="1">
          <span slot="label" class="tab-title">通知公告</span>
          <div class="news-list">
            <div class="news-item" v-for="(item,index) in announcementList.slice(0,3)">
              <div class="news-right">
                <h5 @click="$router.push('/notice/'+item.id)">{{item.title}} <span class="tag"
                    v-if="item.latest=='1'">new</span></h5>
                <p>{{item.describe0}}</p>
                <span>{{item.updateDate&&item.updateDate.substring(0,10)}}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="competition-warp">
      <h5 class="title">
        大赛专区
      </h5>
      <ul>
        <li v-for="item in $dictUtils.getDictList('jab_new_type')" :class="{active:item.value==type}" :key="item.value"
          :label="item.label" @click="getCompetitionList(item.value)">{{item.label}}</li>
      </ul>
      <img class="line" :src="require('../assets/images/line.png')" alt="">
      <div>
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in competitionList" :key="index">
            <div class="competition-item">
              <router-link :to="'/competitions/'+item.id"><img :src="item.image" class="competition-image">
              </router-link>
              <div class="desc">
                {{item.title}}
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="certficate-warp">
      <h5 class="title">
        技能认证
      </h5>
      <ul>
        <li v-for="(item, index) in certificateList" :key="index" @click="$router.push('/certificate?type='+item.id)">
          {{item.title}}
        </li>
      </ul>
      <img class="line" :src="require('../assets/images/line.png')" alt="">

      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in certificateList" :key="index">
          <el-card class="certficate-item">
            <img :src="item.image" />
            <h5>{{item.title}}</h5>
            <button @click="$router.push('/certificate?type='+item.id)">查看详情</button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="platform-warp">
      <h5 class="title">
        考试专区
      </h5>
      <ul>
        <li v-for="(item, index) in platformList.slice(0,3)" :key="index">{{item.title}}</li>
      </ul>
      <img class="line" :src="require('../assets/images/line.png')" alt="">

      <el-row>
        <el-col :span="12" v-for="(item, index) in platformList.slice(0,2)" :key="index">
          <div class="platform-item">
            <a :href="item.url" target="_blank"><img :src="item.image" class="platform-image"></a>
            <div class="desc">
              <h5>{{item.title}}</h5>
              <p>{{item.describe0}}</p>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
    <!-- <div class="cont-warp">
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
                  <router-link :to="{path:'/news/'+item.id}">{{item.title}}</router-link>
                  <span type="danger" v-if="item.latest=='1'">new</span>
                </div>
                <div class="news-time">
                  {{item.updateDate&&item.updateDate.substring(0,10)}}
                </div>
              </div>
            </div>
            <div class="news-list" v-show="activeIndex==1">
              <div class="news-item" v-for="(item,index) in announcementList.slice(0,5)">
                <div class="news-title">
                  <router-link :to="{path:'/notice/'+item.id}">{{item.title}}</router-link>
                  <span type="danger" v-if="item.latest=='1'">new</span>
                </div>

                <div class="news-time">
                  {{item.updateDate&&item.updateDate.substring(0,10)}}
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

        <div class="mt-20">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(item, index) in competitionList" :key="index">
              <el-card :body-style="{ padding: '0px' }" shadow="never">
                <router-link :to="'/competitions/'+item.id"><img :src="item.image" class="competition-image">
                </router-link>
                <div class="desc">
                  {{item.describe0}}
                </div>
              </el-card>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <p class="title">技能认证 <sub>Skill Certification</sub></p>
      <div class="clearfix competition">
        <ul>
          <li v-for="(item, index) in certificateList" :key="index" @click="$router.push('/certificate?type='+item.id)">
            {{item.title}}
          </li>
          <li @click="$router.push('/certificate')">更多.....</li>
        </ul>
      </div>
      <el-row :gutter="10" class="competition">
        <el-col :span="8" v-for="(item, index) in certificateList" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="item.image" class="certificate-image" @click="$router.push('/certificate?type='+item.id)">
          </el-card>
        </el-col>
      </el-row>
      <p class="title">考试专区 <sub>Examination Area</sub></p>
      <div class="clearfix competition">
        <ul>
          <li v-for="(item, index) in platformList.slice(0,3)" :key="index"><a :href="item.url"
              target="_blank">{{item.title}}</a></li>
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
    </div> -->
  </div>
</template>

<script>
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
          slidesPerView: 3,
          spaceBetween: 20,
          slidesPerGroup: 3,
          loop: true,
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
          this.certificateList = data;
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

    .carousel {
      height: 760px;
    }

    .news-warp {
      width: 1400px;
      margin: 80px auto;

      .news-item {
        display: flex;
        margin-bottom: 48px;

        &:last-child {
          margin-bottom: 0;
        }

        .news-left {
          margin-right: 50px;

          img {
            width: 300px;
            height: 170px
          }
        }

        .news-right {
          flex: 1;

          h5 {
            font-size: 20px;
            font-weight: bold;
            color: #303133;
            line-height: 22px;
            margin-bottom: 13px;
            cursor: pointer;
          }

          p {
            font-size: 16px;
            font-weight: 400;
            color: #707070;
            line-height: 28px;
            margin-bottom: 45px;
          }

          span {
            font-size: 14px;
            font-weight: 400;
            color: #303133;
            line-height: 17px;
          }
          .tag{
            background-color: #DC000C;
            color: #fff;
            border-radius: 5px;
            padding:0 5px;
          }
        }
      }
    }



    .competition-warp {
      width: 100%;
      height: 650px;
      background: url(../assets/images/competition-bg.png) center;
      background-size: 100%;
      text-align: center;
      padding: 80px 260px 100px;

      .title {
        font-size: 32px;
        font-weight: normal;
        color: #FFFFFF;
        line-height: 30px;
      }

      ul {
        overflow: hidden;
        clear: both;
        margin: auto;
        display: inline-block;
        margin: 20px 0 10px;

        li {
          float: left;
          display: block;
          padding: 0 10px;
          border-right: 1px solid #1A1718;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          color: #FFFFFF;
          border-left: 1px solid #fff;

          &:first-child {
            padding-left: 0;
            border: none;
          }

          &.active {
            color: #DC000C
          }
        }
      }

      .line {
        display: block;
        margin: 0 auto 80px;
      }

      .competition-item {
        position: relative;
        width: 445px;
        height: 282px;
        margin: 0 auto;

        .competition-image {
          width: 100%;
          height: 100%;
        }

        .desc {
          position: absolute;
          bottom: 0;
          width: 445px;
          height: 60px;
          background: rgb(220 0 12 / 40%);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 60px;
          font-size: 20px;
          font-weight: 400;
          color: #FFFFFF;
        }
      }
    }

    .certficate-warp {
      text-align: center;
      padding: 80px 260px 100px;

      .title {
        font-size: 32px;
        font-weight: normal;
        color: #000000;
        line-height: 30px;
      }

      ul {
        overflow: hidden;
        clear: both;
        margin: auto;
        display: inline-block;
        margin: 20px 0 10px;

        li {
          float: left;
          display: block;
          padding: 0 10px;
          border-left: 1px solid #1A1718;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          color: #999999;
          border-left: 1px solid #999999;

          &:first-child {
            padding-left: 0;
            border: none;
          }

          &.active {
            color: #DC000C
          }
        }
      }

      .line {
        display: block;
        margin: 0 auto 80px;
      }

      .certficate-item {
        padding: 55px 75px;

        img {
          width: 298px;
          height: 298px;
          border-radius: 50%;
        }

        h5 {
          font-size: 20px;
          color: #000000;
          line-height: 38px;
          margin-top: 57px;
          margin-bottom: 40px;
        }

        button {
          width: 180px;
          height: 40px;
          background: #1890FF;
          border-radius: 4px 4px 4px 4px;
          color: #FDFDFE;
          font-size: 18px;
          cursor: pointer;
          border: none;
        }
      }

    }

    .platform-warp {
      text-align: center;
      padding: 80px 260px 100px;
      background: url(../assets/images/platform-bg.png) center;
      background-size: 100%;

      .title {
        font-size: 32px;
        font-weight: normal;
        color: #000000;
        line-height: 30px;
      }

      ul {
        overflow: hidden;
        clear: both;
        margin: auto;
        display: inline-block;
        margin: 20px 0 10px;

        li {
          float: left;
          display: block;
          padding: 0 10px;
          border-left: 1px solid #1A1718;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          color: #999999;
          border-left: 1px solid #999999;

          &:first-child {
            padding-left: 0;
            border: none;
          }

          &.active {
            color: #DC000C
          }
        }
      }

      .line {
        display: block;
        margin: 0 auto 80px;
      }

      .platform-item {
        position: relative;
        width: 670px;
        height: 380px;
        margin: 0 auto;

        .platform-image {
          width: 100%;
          height: 100%;
        }

        .desc {
          position: absolute;
          bottom: 0;
          background: rgb(220 0 12 / 40%);
          padding: 30px 40px;
          text-align: left;

          h5 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 20px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 36px;
            margin-bottom: 18px;
            border-bottom: 1px solid #fff;
            display: inline-block;
            padding-bottom: 10px;
          }

          p {
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 22px;
          }
        }
      }
    }

    .cont-warp {
      max-width: 80%;
      margin: 0 auto;

      .carousel-title {
        position: absolute;
        width: 100%;
        height: 24px;
        line-height: 24px;
        padding-left: 15px;
        font-size: 14px;
        bottom: 0;
        background: rgb(26 19 17 / 50%);
        color: #ffffff;
      }
    }
  }



  // .title {
  //   font-size: 22px;
  //   line-height: 22px;
  //   font-weight: bold;
  //   border-left: 5px solid #DC000C;
  //   padding-left: 10px;
  //   margin-bottom: 15px;
  // }

  // .title sub {
  //   font-size: 13px;
  //   color: #898b8c;
  // }

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

    a {
      color: #303133;
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

  // .desc {
  //   padding: 10px;
  //   background-color: #E0E1E4;
  //   position: relative;
  //   font-size: 14px;
  //   height: 74px;
  //   line-height: 20px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   display: -webkit-box;
  //   -webkit-line-clamp: 3;
  //   -webkit-box-orient: vertical;
  // }

  // .desc:after {
  //   content: "";
  //   display: block;
  //   width: 64px;
  //   height: 5px;
  //   background-color: #DC000C;
  //   position: absolute;
  //   top: 0;
  //   left: 15px;
  // }

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
    font-size: 16px;
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

  // .news-list .news-item {
  //   margin: 10px 0;
  // }

  .news-list .news-item .news-title {
    flex: 1;
    padding: 0 15px;
    position: relative;
    display: flex;
    flex-wrap: nowrap;

    a {
      color: #000;
      line-height: 22px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    span {
      display: inline-block;
      border-radius: 20px;
      background-color: #DC000C;
      color: #fff;
      padding: 0 7px;
      margin-left: 5px;
      height: 20px;
      text-align: center;
    }

    // &:after {
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   left: 0;
    //   top: 7px;
    //   width: 8px;
    //   height: 8px;
    //   background-color: #DC000C;
    //   border-radius: 50%;
    // }
  }

  .news-list .news-item .news-time {
    width: 85px;
    font-size: 14px;
    color: #707070;
  }

  .news-item {
    display: flex;
  }

  .certificate-image {
    width: 100%;
    height: 112px;
    cursor: pointer;
  }

  .platform-image {
    width: 100%;
    height: 170px;
  }

  .el-backtop {
    color: #DC000C;
  }
</style>
