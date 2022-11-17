<template>
  <div class="box-card">
    <el-row :gutter="15" class="mt-20">
      <el-col :span="24" v-for="(item, index) in dataList" :key="index" class="el-col">
        <div class="file-item">
          <img :src="require('../../assets/images/file-icon.png')" :alt="item.title">
          <div class="other-info">
            <h5 class="item">{{item.title}}</h5>
            <p>文件大小：{{(item.size/1024/1024).toFixed(2)}}M <span>上传日期：{{item.updateDate.substring(0,10)}}</span>
              <!-- | {{item.times}}次下载 -->
            </p>

          </div>
          <el-button type="primary" size="small" @click="downloadFile(item.file)">下载</el-button>
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
      downloadFile(url) {
        var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
        const el = document.createElement('a');
        el.style.display = 'none';
        el.setAttribute('target', '_blank');
        /**
         * download的属性是HTML5新增的属性
         * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
         * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
         * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
         */
        fileName && el.setAttribute('download', fileName);
        el.href = url;
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
      }

    }
  }
</script>

<style lang="scss" scoped>
  .box-card {
    width: 80%;
    margin: 0 auto;
  }

  .competition-image {
    width: 100%;
    height: 156px;
  }

  .file-item {
    border-bottom: 1px dashed #C0C4CC;
    padding: 20px;
    display: flex;

    img {
      width: 48px;
      height: 48px;
      display: block;
      margin-right: 20px;
    }

    .other-info {
      flex: 1;
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
        margin-top: 10px;

        span {
          margin-left: 10px;
        }
      }
    }
  }



  .pager {
    text-align: center;
    padding: 20px;
  }
</style>
