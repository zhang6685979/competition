<template>
  <div class="box-card">
    <el-row :gutter="15" class="mt-20">
      <el-col :span="8" v-for="(item, index) in dataList" :key="index" class="el-col">
        <div class="file-item">
          <img :src="require('../../assets/images/file-icon.png')" :alt="item.title">
          <div class="other-info">
            <h5>{{item.title}}</h5>
            <p>文件大小：{{(item.size/1024/1024).toFixed(2)}}M | {{item.times}}次下载</p>
            <el-button type="primary" size="small" @click="downloadFile(item.file,item.title)">下载</el-button>
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
          url: '/competition/competitionDownload/public/list',
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
      },
	  downloadFile(url, fileName = '未知文件') {
	    this.$http.get(url)
	    .then(res => {
	        const blob = new Blob([res.data], {type: res.headers['content-type']});
	        const a = document.createElement("a");
	        const objectUrl = window.URL.createObjectURL(blob);
	        a.download = fileName;
	        a.href = objectUrl;
	        a.click();
	        window.URL.revokeObjectURL(objectUrl);
	        a.remove();
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
  .competition-image {
    width: 100%;
    height: 156px;
  }

  .el-col {
    margin-bottom: 15px;
  }

  .file-item {
    background-color: #F5F5F5;
    padding: 30px;
    display: flex;

    img {
      width: 48px;
      height: 48px;
      display: inline-block;
      margin-right: 20px;
    }

    .other-info {
      h5 {
        font-size: 16px;
        color: #000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        font-size: 14px;
        color: #707070;
        margin: 10px 0;
      }
    }
  }



  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
