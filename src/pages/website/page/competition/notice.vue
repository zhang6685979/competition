<template>
  <div>

    <el-row class="item" :gutter="20" v-for="(item,index) in dataList" :key="index">
      <el-col :span="6">
          <router-link class="thumbnail" :to="{path:'/news/'+item.id}">
          <img :src="item.image" ></router-link>
      </el-col>
      <el-col :span="18">
        <div class="item-heading">
          <div class="text-muted pull-right">
            <span>
              <i class="el-icon-view"></i> {{item.times}}</span> &nbsp;
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

    <div class="pager">
      <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
        :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getNewsList">
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
        this.tablePage.currentPage = currentPage||1;
        this.$http({
          url: '/announcement/announcement/public/list',
          method: 'get',
          params: {
            'current': this.tablePage.currentPage,
            'size': this.tablePage.pageSize,
            'cid':this.$route.params.id
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
 .item {
   border-bottom: 1px solid #C0C4CC;
   padding: 10px 0;

   .thumbnail {
     display: block;
     width: 100%;
     height: 160px;

     img {
       width: 100%;
       height: 100%
     }

   }

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
     ;
   }
 }

 .pager {
   text-align: center;
   padding: 20px;
 }
</style>
