<template>
  <div>
    <el-row :gutter="15" class="mt-20">
      <el-col :span="6" v-for="(item, index) in dataList" :key="index" class="el-col">
        <el-card :body-style="{ padding: '0px'}" shadow="never">
          <img :src="item.image" class="competition-image">
          <div class="desc">
            <h5>{{item.title}}</h5>
            <p>{{item.describe0}}</p>
            <el-button size="small" type="primary">立即观看</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="pager">
      <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
        :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      cid: String
    },
    data() {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 8
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(currentPage) {
        var cid = this.$route.params.id || this.cid;
        this.tablePage.currentPage = currentPage || 1;
        this.$http({
          url: '/competition/competitionLive/public/list',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'cid': cid
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

<style lang="scss" scoped>
  .competition-image {
    width: 100%;
    height: 156px;
  }

  .el-col {
    margin-bottom: 15px;
  }

  .desc {
    padding: 14px;
    background-color: #EBEBEB;
    position: relative;
    h5 {
      font-size: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      height: 42px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin:6px 0;
    }
  }

  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
