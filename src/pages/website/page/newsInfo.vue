<template>
  <el-card class="box-card">
    <h1>{{inputForm.title}}</h1>
    <div class="other-info">
      <span><i class="el-icon-time"></i> {{inputForm.updateDate.substring(0,10)}}</span>&nbsp;&nbsp;
      <el-tag v-if="inputForm.top==1" type="success" size="small" effect="dark">
        置顶
      </el-tag>
      <el-tag type="warning" size="small" effect="dark" class="pull-right">
        <i class="el-icon-view"></i> {{inputForm.times}}
      </el-tag>
    </div>
    <div class="html-content" v-html="inputForm.content">

    </div>
  </el-card>
</template>

<script>
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
          describe0: ''
        }
      }
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
    width: 80%;
    margin: 0 auto 20px;

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
