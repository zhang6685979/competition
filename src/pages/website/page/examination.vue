<template>
  <div>
    <img v-if="banners['platform']" :src="banners['platform']" alt="" class="banner">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in dataList" :key="index">
          <el-card :body-style="{ padding: '0px' }" class="item" shadow="never">
            <a :href="item.url" target="_blank"><img :src="item.image" class="certificate-image"></a>
            <div class="other-info">
              <h5 :title="item.title">{{ item.title }}</h5>
              <p :title="item.describe0">{{item.describe0}}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="pager">
        <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
          :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
        </el-pagination>
      </div>
    </el-card>
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
          url: '/platform/platform/public/list',
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
    },
    computed: {
      banners: {
        get() {
          return this.$store.state.config.banners
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    height: 330px;
  }

  .box-card {
    width: 80%;
    margin: 0 auto;

    .item {
      border: none !important;

      img {
        width: 100%;
        height: 170px;
      }

      .other-info {
        h5 {
          color: #303133;
          font-size: 16px;
          margin: 10px 0;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p {
          font-size: 14px;
          color: #707070;
          line-height: 25px;
          height: 80px;
          overflow: hidden;
        }
      }
    }

    .pager {
      text-align: center;
      padding: 20px;
    }
  }
</style>
