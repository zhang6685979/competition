<template>
  <div>
    <img v-if="banners['platform']" :src="banners['platform']" alt="" class="banner">
    <div class="box-card">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item,index) in dataList" :key="index">
          <div  class="item">
            <a :href="item.url" target="_blank"><img :src="item.image" class="certificate-image"></a>
            <div class="other-info">
              <h5 :title="item.title">{{ item.title }}</h5>
              <p :title="item.describe0">{{item.describe0}}</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="pager">
        <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
          :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
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
    margin: 20px auto;

    .item {
      border: none !important;
      position: relative;
      width: 670px;
      height: 380px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }

      .other-info {
        position: absolute;
        width: 100%;
        bottom:0;
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

    .pager {
      text-align: center;
      padding: 20px;
    }
  }
</style>
