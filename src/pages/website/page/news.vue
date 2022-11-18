<template>
  <div>
    <img v-if="banners['news']" :src="banners['news']" alt="" class="banner">
    <div class="box-card">
      <div class="item" v-for="(item,index) in dataList" :key="index" @click="$router.push('/news/'+item.id)">
        <div class="left">
            <img :src="item.image">
        </div>
        <div class="right">
          <div class="item-heading">
            <div class="text-muted pull-right">
              <span>
                <i class="el-icon-time"></i> {{item.updateDate.substring(0,10)}}</span>
            </div>
            <a>{{item.title}}</a>
          </div>
          <p class="item-content">
            {{item.describe0}}
          </p>
        </div>
      </div>

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
          url: '/news/news/public/list',
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
          this.$forceUpdate()
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
      border-bottom: 1px solid #C0C4CC;
      padding: 20px 0;
      display: flex;
      cursor: pointer;
      &:nth-last-child(2)
      {
        border:none;
      }

      .left {
        display: block;
        width: 240px;
        height: 160px;
        margin-right: 30px;
        img {
          width: 100%;
          height: 100%
        }

      }

      .right {
        flex:1;
        .item-heading {
          margin-top: 10px;

          a {
            font-size: 20px;
            font-weight: bold;
            color: #303133;
            line-height: 30px;
          }

          .text-muted {
            float: right;
            colot: #707070;
            font-size: 16px;
          }
        }

        .item-content {
          font-size: 16px;
          color: #707070;
          line-height: 30px;
        }
      }

    }

    .pager {
      text-align: center;
      padding: 20px;
    }
  }
</style>
