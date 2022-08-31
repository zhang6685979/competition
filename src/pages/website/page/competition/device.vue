<template>
  <div>
    <!-- <template v-if="!infoVisible">
      <el-row :gutter="15" class="mt-20">
        <el-col :span="6" v-for="(item, index) in dataList" :key="index" class="el-col">
          <el-card :body-style="{ padding: '0px'}" shadow="never">
            <img :src="item.image" class="competition-image" @click="showDesc(item)">
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
    </template> -->
    <div class="device-info">
      <!-- <button class="btn" @click="infoVisible=false">返 回</button> -->
      <h5>{{currItem.title}}</h5>
      <el-divider></el-divider>
      <div class="content" v-html="currItem.describe0"></div>
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
        },
        infoVisible:false,
        currItem:{}
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
          url: '/competition/competitionEquipment/public/list',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'cid': cid
          }
        }).then(({
          data
        }) => {
          var records = data.records
          if(records&&records.length>0){
            this.currItem = records[0];
          }
        })
      },
      showDesc(item){
        this.currItem = item;
        this.infoVisible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .competition-image {
    width: 100%;
    height: 156px;
    cursor: pointer;
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
  .device-info{
    .btn {
      width: 120px;
      height: 45px;
      background: #FFFFFF;
      border: 1px solid #DC000C;
      font-size: 16px;
      color: #DC000C;
      cursor: pointer;
      margin-bottom: 20px;
    }
    h5{margin-bottom: 20px;font-size: 20px;}
  }
</style>
