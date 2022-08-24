<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="11">
        <img :src="require('../assets/images/suggest-icon.png')">
      </el-col>
      <el-col :span="12">
        <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" class="el-form"
          label-width="120px">
          <el-form-item label="姓名" prop="name" :rules="[
                  {required: true, message:'姓名不能为空', trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.name" placeholder="请填写姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile" :rules="[
                  {required: true, message:'联系电话不能为空', trigger:'blur'},
                  {validator: validator.isMobile, trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.mobile" placeholder="请填写联系电话"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email" :rules="[
                  {required: true, message:'电子邮箱不能为空', trigger:'blur'},
                  {validator: validator.isEmail, trigger:'blur'}
                 ]">
            <el-input v-model="inputForm.email" placeholder="请填写电子邮箱"></el-input>
          </el-form-item>
          <el-form-item label="留言标题" prop="title" :rules="[
                      {required: true, message:'留言标题不能为空', trigger:'blur'}
                     ]">
            <el-input v-model="inputForm.title" placeholder="请填写留言标题" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item label="留言内容" prop="content" :rules="[
                      {required: true, message:'留言内容不能为空', trigger:'blur'}
                     ]">
            <el-input type="textarea" v-model="inputForm.content" placeholder="请填写留言内容"></el-input>
          </el-form-item>

          <div class="btn-warp">
            <el-button type="primary" @click="doSubmit">确定</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div class="other-info">
      <img :src="require('../assets/images/map.png')" alt="">
      <table class="table table-data">
        <tbody>
          <tr>
            <th>
              电话：
            </th>
            <td>
              +86371-86589327<br>
              +86371-86589328
            </td>
          </tr>
          <tr>
            <th>
              Email：
            </th>
            <td>
              <a href="mailto:railvehicle.support@jiean.net">railvehicle.support@jiean.net</a>
            </td>
          </tr>
          <tr>
            <th>
              微信：
            </th>
            <td>
              jieangaoke
            </td>
          </tr>
          <tr>
            <th>
              地址：
            </th>
            <td>
              郑州市高新技术产业开发区科学大道133号。
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        inputForm: {
          id: '',
          title: '',
          content: '',
          name: '',
          mobile: '',
          email: ''
        }
      }
    },
    components: {},
    created() {},
    methods: {
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: '/message/messageBoard/public/save',
              method: 'post',
              data: this.inputForm
            }).then(({
              data
            }) => {
              this.$refs.inputForm.resetFields()
              this.$message.success("留言成功!")
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-card {
    width: 80%;
    margin: 0 auto;
    height: 700px;
    background: url(../assets/images/suggest-bg.png) no-repeat #fff;
    background-position: bottom center;
    background-size: 100% 515px;
    position: relative;

    img {
      width: 370px;
      height: 80px;
      margin-left: 10%;
      margin-top: 30px;
    }

    .el-form {
      margin-top: 100px;
    }

    .btn-warp {
      text-align: center;

      button {
        background-color: #cf0a2c;
        border-color: #a80824;
      }
    }
    .other-info{
      position: absolute;
     position: absolute;
     bottom: 0%;
     left: 10%;
     width: 30%;
     height: 480px;
      img{width:100%;height:240px;margin:0 0 20px 0;}
    }
    .table-data {
      font-size: 16px;
      width:100%;
      tr{
        height:30px;
        th {
          font-weight: 400;
          vertical-align: top;
        }

        td a {
          color: #000;font-size: 16px
        }
      }
    }
  }
</style>
