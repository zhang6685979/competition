<template>
  <div class="index-warp">
    <el-backtop :bottom="60"></el-backtop>
    {{carouselList}}
    <el-carousel :interval="5000" height="560px">
      <el-carousel-item v-for="item in 4" :key="item">
        <img class="image" :src="require('../assets/images/img2.jpg')"/>
      </el-carousel-item>
    </el-carousel>
    <div class="cont-warp">
      <el-row class="mt-30 mb-30" :gutter="20">
        <el-col :span="12">
          <el-carousel height="250px">
            <el-carousel-item v-for="item in 4" :key="item">
              <img :src="require('../assets/images/bisai.png')" class="image"/>
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
            <button class="more">更多+</button>
          </div>
          <div class="tab-content">
            <div class="news-list">
              <div class="news-item">
                <div class="news-title">
                  <a
                    href="">关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知</a>
                </div>
                <div class="news-status">
                  <span type="danger">new</span>
                  <p>2022-08-08</p>
                </div>
              </div>
              <div class="news-item">
                <div class="news-title">
                  <a
                    href="">关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知</a>
                </div>
                <div class="news-status">
                  <span type="danger">new</span>
                  <p>2022-08-08</p>
                </div>
              </div>
              <div class="news-item">
                <div class="news-title">
                  <a
                    href="">关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知</a>
                </div>
                <div class="news-status">
                  <span type="danger">new</span>
                  <p>2022-08-08</p>
                </div>
              </div>
              <div class="news-item">
                <div class="news-title">
                  <a
                    href="">关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知</a>
                </div>
                <div class="news-status">
                  <span type="danger">new</span>
                  <p>2022-08-08</p>
                </div>
              </div>
              <div class="news-item">
                <div class="news-title">
                  <a
                    href="">关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知关于举办2022一带一路暨金砖国家技能发展与技术创新大赛之飞机维修赛项的报名预通知</a>
                </div>
                <div class="news-status">
                  <span type="danger">new</span>
                  <p>2022-08-08</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <p class="title">大赛专区 <sub>Competition Zone</sub></p>
      <div class="competition">
        <div class="clearfix">
          <ul>
            <li>车辆技术</li>
            <li>运营管理</li>
            <li>飞机维修</li>
            <li>应急安全</li>
            <li>列车司机</li>
            <li>更多.....</li>
          </ul>
        </div>
        <el-row :gutter="15" class="mt-20">
          <el-col :span="6" v-for="(o, index) in 4" :key="o">
            <el-card :body-style="{ padding: '0px' }" shadow="never">
              <img :src="require('../assets/images/bisai.png')" class="image">
              <div class="desc">
                <span>关于举办2022一带一路暨金砖国家技能发展与技术创新大之飞机维修赛项的报名预通知</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <p class="title">技能认证 <sub>Competition Zone</sub></p>
      <div class="clearfix competition">
        <ul>
          <li>车辆维修与保养证书</li>
          <li>更多.....</li>
        </ul>
      </div>
      <el-row :gutter="10" class="competition">
        <el-col :span="12" v-for="(o, index) in 2" :key="o">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="require('../assets/images/zhengshu.png')" class="image">
          </el-card>
        </el-col>
      </el-row>
      <p class="title">考试专区 <sub>Competition Zone</sub></p>
      <div class="clearfix competition">
        <ul>
          <li>理论考核平台</li>
          <li>实训竞赛平台</li>
          <li>更多.....</li>
        </ul>
      </div>
      <el-row :gutter="10" class="competition">
        <el-col :span="8" v-for="(o, index) in 3" :key="o">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="require('../assets/images/kaoshi.png')" class="image">
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: 0,
        newsList:[],
        carouselList:[]
      }
    },
    created(){
      //this.getNewsList();
      this.getCarouselList();
    },
    methods: {
      getCarouselList(){
        this.$http({
          url: '/carousel/carousel/public/list',
          method: 'get'
        }).then(({data})=>{
          this.carouselList = data;
        })
      },
      getNewsList() {
         this.$http({
           url: '/news/news/list',
           method: 'get'
         }).then(({data})=>{
           console.log(data);
           this.newsList = data;
         })
      }
    }
  }
</script>

<style>
  .index-warp {
    margin-top: -90px;
  }

  .cont-warp {
    max-width: 1200px;
    margin: 0 auto;
  }

  .title {
    font-size: 22px;
    line-height: 22px;
    font-weight: bold;
    border-left: 5px solid #E50006;
    padding-left: 10px;
    margin-bottom: 15px;
  }

  .title sub {
    font-size: 13px;
    color: #898b8c;
    vertical-align: text-bottom;
  }

  .competition {
    margin-bottom: 20px;
    padding: 0 15px;
  }

  .competition ul li {
    float: left;
    display: block;
    padding: 0 10px;
    border-right: 1px solid #1A1718;
    cursor: pointer;
    font-size:12px;
  }

  .competition ul li:first-child {
    padding-left: 0;
  }

  .competition ul li:last-child {
    color: #E50006;
  }

  .image {
    width: 100%;
    height:100%;
  }

  .desc {
    padding: 14px;
    background-color: #E0E1E4;
    position: relative;
  }

  .desc:after {
    content: "";
    display: block;
    width: 64px;
    height: 5px;
    background-color: #E50006;
    position: absolute;
    top: 0;
    left: 15px;
  }

  .mytabs {
    position: relative;
    border-bottom: 1px solid #E50006;
    height: 30px;
  }
  .mytabs .more{border:none;background: #E7001C;border-radius: 5px;padding:0 8px;color: #fff;float: right;}

  .mytabs li {
    display: block;
    float: left;
    padding-right: 20px;
    color: #1A1718;
    cursor: pointer;
  }

  .mytabs li:hover,
  .mytabs li.active {
    color: #E50006;
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
    border-top: 6px solid #E50006;
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
  }

  .news-list .news-item .news-title {
    flex: 1;
    align-items: center;
    display: flex;
    padding-right: 15px;
  }

  .news-list .news-item .news-status {
    width: 75px;
    font-size: 12px;
  }

  .news-list .news-item a {
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
    background-color: #E7001C;
    color: #fff;
    padding: 0 5px;
    text-align: center;
  }
  .el-backtop{color: #E50006;}


</style>
