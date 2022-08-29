<template>
  <div>
    <el-row class="mt-30 mb-30" :gutter="20">
      <el-col :span="12">
        <el-carousel height="320px"  indicator-position="none">
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
        <a class="pull-right" @click="$router.push('/competition/'+cid+'/news')">查看更多>></a>
      </el-col>
    </el-row>
    <el-row :gutter="20">
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
    <p class="title">赛事风采 <sub>Competition Style</sub></p>
    <competition-style :cid="cid"></competition-style>
  </div>
</template>

<script>
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
        newsList: []
      }
    },
    components:{
      CompetitionStyle
    },
    watch: {
      '$route.params.id': {
        handler(newVal, oldVal) {
           this.cid = newVal;
           this.getNewsList();
        },
        deep: true,
      }
    },
    mounted() {
      this.getNewsList();
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
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    text-align: center;
    color: #fff;
    width: 100%;
    margin: 0 auto;
    padding: 30px 0;
    cursor: pointer;
    img{width: 72px;height: 72px;margin-bottom:8px;}
  }

  .card1 {
    background-color: #F27E00;
  }

  .card2 {
    background-color: #004093;
  }

  .card3 {
    background-color: #53955E;
  }

  .card4 {
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
    }
  }

</style>
