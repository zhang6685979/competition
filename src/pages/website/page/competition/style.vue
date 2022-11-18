<template>
  <div class="box-card">
    <el-row :gutter="15" class="mt-20">
      <el-col :span="8" v-for="(item, index) in dataList" :key="index" class="el-col">
        <div class="style-card">
          <img :src="item.image" class="competition-image">
          <div class="desc">
            {{item.describe0}}
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
</template>

<script>
  export default {
    props:{cid:String},
    data() {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 9
        }
      }
    },
    watch:{
      cid:function(newVal,oldVal){
        if(newVal!=oldVal){
          this.getList();
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(currentPage) {
        var cid = this.$route.params.id || this.cid;
        this.tablePage.currentPage = currentPage||1;
        this.$http({
          url: '/competition/competitionStyle/public/list',
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
  .box-card{
    width: 80%;
    margin: 0 auto;
  }

  .style-card {
    position: relative;
    width: 445px;
    height: 282px;
    margin: 0 auto 20px;

    .competition-image {
      width: 100%;
      height: 100%;
      display: block;
    }

    .desc {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgb(220 0 12 / 40%);
      font-size: 20px;
      height: 60px;
      line-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #fff;
      text-align: center;
    }
  }
  .el-col{
    margin-bottom: 15px;
  }
  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
