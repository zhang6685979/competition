<template>
  <div class="container">
    <el-carousel :interval="5000" height="320px">
      <el-carousel-item v-for="item in 4" :key="item">
        <img class="image" :src="require('../assets/images/bisai.png')" />
      </el-carousel-item>
    </el-carousel>
    <div class="main-content">
      当前位置：首页-大赛专区
      <el-divider></el-divider>

      <el-row :gutter="20" class="mt-20" v-for="(item,index) in dataList" :key="index">
        <el-col :span="12">
          <el-card :body-style="{ padding: '0px',height:'260px' }">
            <img :src="item.image" class="bisai-img">
          </el-card>
        </el-col>
        <el-col :span="12">
          <div class="bisai-info">
            <h5>{{item.title}}</h5>
            <p>
              {{item.describe0}}
            </p>
          </div>
        </el-col>
      </el-row>

      <div class="pager">
        <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
          :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getNewsList">
        </el-pagination>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(currentPage) {
        this.tablePage.currentPage = currentPage || 1;
        this.$http({
          url: '/competition/competition/public/list',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize
          }
        }).then(({
          data
        }) => {
          this.dataList = data.records
          this.tablePage.total = data.total
        })
      }
    }
  }
</script>

<style scoped>
  .container {
    background-color: #fff;
    margin-top: -20px;
  }

  .main-content {
    max-width: 1200px;
    margin: 20px auto 0;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .bisai-img {
    width: 100%;
    height: 100%;
  }
  .bisai-info {
    background-color: #E0E1E4;
    height: 260px;
    padding: 20px;
    box-sizing: border-box;
    h5 {
      font-size: 16px;
      color: #1A1718;
      font-weight: bold;
      margin-bottom: 20px;
      position: relative;
      padding-top: 20px;
      &:after {
        content: "";
        display: block;
        width: 110px;
        height: 10px;
        background-color: #E50006;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    p {
      font-size: 14px;
    }
  }
  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
