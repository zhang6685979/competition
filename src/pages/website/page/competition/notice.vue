<template>
  <div>
   <template v-if="!infoVisible">
     <el-row class="item" :gutter="20" v-for="(item,index) in dataList" :key="index">
       <el-col :span="24">
         <div class="item-heading">
           <div class="text-muted pull-right">
             <span>
               <i class="el-icon-view"></i> {{item.times}}</span> &nbsp;
             <span>
               <i class="el-icon-time"></i> {{item.updateDate.substring(0,10)}}</span>
           </div>
           <a @click="showInfo(item)">{{item.title}}</a>
         </div>
         <p class="item-content">
           {{item.describe0}}
         </p>
       </el-col>
     </el-row>

     <div class="pager">
       <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
         :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
       </el-pagination>
     </div>
   </template>


    <div class="notice-info" v-if="infoVisible">
      <button class="btn" @click="infoVisible=false">返 回</button>
      <h1>{{currNotice.title}}</h1>
      <div class="other-info">
        <span><i class="el-icon-time"></i> {{currNotice.updateDate.substring(0,10)}}</span>&nbsp;&nbsp;
        <el-tag v-if="currNotice.top==1" type="success" size="small" effect="dark">
          置顶
        </el-tag>
        <el-tag type="warning" size="small" effect="dark" class="pull-right">
          <i class="el-icon-view"></i> {{currNotice.times}}
        </el-tag>
      </div>
      <el-divider></el-divider>
      <div class="html-content" v-html="currNotice.content">

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
        },
        currNotice:{},
        infoVisible:false
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
      },
      showInfo(notice){
         this.currNotice = notice;
         this.infoVisible = true
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

 .notice-info {
   margin: 0 auto 20px;
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
   h1 {
     font-size: 24px;
     margin: 0 0 10px;
   }

   .other-info {
     font-size: 12px;
     padding: 10px 0;
   }

   .pull-right {
     float: right;
   }
 }
</style>
