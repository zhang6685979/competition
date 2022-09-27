<template>
  <div class="box-card">
    <template v-if="!infoVisible">
      <div class="item" v-for="(item,index) in dataList" :key="index">
        <div class="left">
          <a class="thumbnail" @click="showInfo(item)">
            <img :src="item.image">
          </a>
        </div>
        <div class="right">
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
        </div>
      </div>

      <div class="pager">
        <el-pagination background layout="prev, pager, next" :page-size="tablePage.pageSize"
          :current-page="tablePage.currentPage" :total="tablePage.total" @current-change="getList">
        </el-pagination>
      </div>
    </template>

    <div v-if="infoVisible" class="news-info">
      <button class="btn" @click="infoVisible=false">返 回</button>
      <h1>{{currNews.title}}</h1>
      <div class="other-info">
        <span><i class="el-icon-time"></i> {{currNews.updateDate.substring(0,10)}}</span>&nbsp;&nbsp;
        <el-tag v-if="currNews.top==1" type="success" size="small" effect="dark">
          置顶
        </el-tag>
        <el-tag type="warning" size="small" effect="dark" class="pull-right">
          <i class="el-icon-view"></i> {{currNews.times}}
        </el-tag>
      </div>
      <el-divider></el-divider>
      <div class="html-content clearfix" v-html="currNews.content">

      </div>
      <div v-if="currNews.appendix">
        附件下载：
        <DownloadList v-model="currNews.appendix"></DownloadList>
      </div>
    </div>

  </div>
</template>

<script>
  import NewsInfo from '../newsInfo'
  import DownloadList from '../../components/DownloadList'
  export default {
    data() {
      return {
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10
        },
        currNews:{},
        infoVisible:false
      }
    },
    components:{
      NewsInfo,
      DownloadList
    },
    created() {
      this.getList();
    },
    methods: {
      getList(currentPage) {
        this.tablePage.currentPage = currentPage||1;
        this.$http({
          url: '/news/news/public/list',
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
      showInfo(news){
         this.currNews = news;
         this.infoVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-card{
    width: 80%;
    margin: 20px auto;
  }
 .item {
   border-bottom: 1px solid #C0C4CC;
   padding: 20px 0;
   display: flex;
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
 .news-info {
   margin: 0 auto 20px;
   width:1000px;
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
