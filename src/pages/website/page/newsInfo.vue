<template>
  <el-card class="box-card">
    <h1>{{inputForm.title}}</h1>
    <div class="other-info">
      <span><i class="el-icon-time"></i>
        {{inputForm.updateDate&&inputForm.updateDate.substring(0,10)}}</span>&nbsp;&nbsp;
      <el-tag v-if="inputForm.top==1" type="success" size="small" effect="dark">
        置顶
      </el-tag>
    </div>
    <div class="html-content clearfix" v-html="inputForm.content">

    </div>
    <div v-if="inputForm.appendix">
      附件下载：
      <DownloadList v-model="inputForm.appendix"></DownloadList>
    </div>

  </el-card>
</template>

<script>
  import DownloadList from '../components/DownloadList'
  export default {
    data() {
      return {
        inputForm: {
          id: '',
          title: '',
          type: '',
          image: '',
          content: '',
          latest: '',
          top: '',
          describe0: '',
          appendix:''
        }
      }
    },
    components:{
      DownloadList
    },
    mounted() {
      this.queryById()
    },
    methods: {
      queryById() {
        var id = this.$route.params.id;
        this.$http({
          url: '/news/news/public/queryById',
          method: 'get',
          params: {
            id: id
          }
        }).then(({
          data
        }) => {
          this.inputForm = data;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-card {
    width: 1000px;
    margin: 20px auto;

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
