<template>
  <div>
    <div class="box-card">
      <h1 class="text-center">证书查询</h1>
      <el-form size="small" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()"
        @submit.native.prevent label-width="150px">
        <el-form-item label="证书类别" prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择" style="width: 100%;">
            <el-option v-for="(item,index) in certificateList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证书编号" prop="no">
          <el-input size="small" v-model="searchForm.no" placeholder="证书编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="[
              {required: true, message:'姓名不能为空', trigger:'blur'}
             ]">
          <el-input size="small" v-model="searchForm.name" placeholder="学员名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcardno" :rules="[
              {required: true, message:'身份证号不能为空', trigger:'blur'}
             ]">
          <el-input size="small" v-model="searchForm.idcardno" placeholder="身份证号" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList()" size="small" icon="el-icon-search">查询</el-button>
          <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="20" v-if="dataList.length>0">
        <el-col :span="6" v-for="(item,index) in dataList" :key="index">
          <el-card :body-style="{ padding: '0px' }" class="item" shadow="never">

            <el-image class="certificate-image" :src="item.image" :preview-src-list="[item.image]">
            </el-image>
            <div class="other-info">
              <p>证书分类：{{item.title}}</p>
              <p>证书编号：{{item.no}}</p>
              <p>姓名：{{item.name}}</p>
              <p>身份证号：{{item.idcardno}}</p>
              <el-button size="small" type="primary" @click="downloadFile(item.image)">下载证书</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        searchForm: {
          type: '',
          name: '',
          idcardno: '',
          no: ''
        },
        dataList: [],
        certificateList: [] //证书分类
      }
    },
    created() {
      this.searchForm.type = this.$route.query.certificateType;
      this.getCertificateList();
    },
    methods: {
      getCertificateList() {
        this.$http({
          url: '/certificate/certificate/public/list',
          method: 'get'
        }).then(({
          data
        }) => {
          this.certificateList = data;
        })
      },
      getList() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: '/certificate/certificate/public/record/search',
              method: 'get',
              params: {
                ...this.searchForm
              }
            }).then(({
              data
            }) => {
              this.dataList = data;
              if (data && data.length == 0) {
                this.$message.warning('未查询到您的证书信息，请合适查询条件是否正确!')
              }
            })
          }
        })
      },
      resetSearch() {
        this.$refs.searchForm.resetFields()
        this.getList()
      },
      downloadFile(url) {
        var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
        this.$http.get(url)
          .then(res => {
            const blob = new Blob([res.data], {
              type: res.headers['content-type']
            });
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
  .box-card {
    width: 60%;
    margin: 20px auto;

    .text-center {
      text-align: center;
      margin-bottom: 30px;
    }

    .item {
      border: none !important;

      .certificate-image {
        width: 100%;
        height: 160px;
      }

      .other-info {
        background-color: #ebebeb;
        padding: 10px;

        p {
          font-size: 16px;
          color: #707070;
          line-height: 25px;
          overflow: hidden;
        }
      }
    }
  }
</style>
