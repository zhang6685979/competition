<template>
  <div class="container">
    <img v-if="banners['competition']" :src="banners['competition']" alt="" class="banner">
    <div class="main-content">
      <el-row :gutter="20" class="mt-20" >
        <el-col :span="12" v-for="(item,index) in dataList" :key="index">
          <div class="item"  @click="$router.push('/competition/'+item.id+'/index')">
            <img :src="item.image" class="bisai-img">
            <div class="desc">{{item.title}} <img :src="require('../assets/images/arrow.png')" alt=""></div>
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

<style scoped lang="scss">
  .container {
    background-color: #fff;

    .banner {
      width: 100%;
      height: 330px;
    }

    .main-content {
      max-width: 80%;
      margin: 20px auto 0;
    }
  }

  .item{
    width: 680px;
    height:380px;
    margin: 0 auto 20px;
    position: relative;
    cursor: pointer;
    .desc{
      width: 100%;
      height:84px;
      line-height:84px;
      white-space: nowrap;
      overflow:hidden;
      text-overflow: ellipsis;
      position: absolute;
      bottom:0;
      color: #fff;
      background: rgba(0,0,0,0.4);
      padding:0 28px;
      img{
        float: right;
        width: 28px;
        height:28px;
        margin-top: 28px;
        vertical-align: middle;
      }
    }
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

    h5 a {
      display: block;
      font-size: 20px;
      line-height: 29px;
      color: #1A1718;
      font-weight: bold;
      margin-bottom: 20px;
      position: relative;
      padding-top: 20px;

      &:after {
        content: "";
        display: block;
        width: 90px;
        height: 6px;
        background-color: #DC000C;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    p {
      font-size: 16px;
      line-height: 26px;
    }
  }

  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
