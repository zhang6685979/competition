<template>
  <div>
    <el-row :gutter="15" class="mt-20">
      <el-col :span="6" v-for="(item, index) in dataList" :key="index" class="el-col">
        <el-card :body-style="{ padding: '0px'}" shadow="never">
          <img :src="item.image" class="competition-image">
          <div class="desc">
            {{item.title}}
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
        var cid = this.$route.params.id || this.cid;
        this.tablePage.currentPage = currentPage||1;
        this.$http({
          url: '//competition/competitionEquipment/public/list',
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
  .el-col{
    margin-bottom: 15px;
  }
  .desc {
    background-color: #EBEBEB;
    position: relative;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
