<template>
  <div>
    <img v-if="banners['complaint']" :src="banners['complaint']" alt="" class="banner">
    <div class="box-card">
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" class="el-form" label-width="120px">
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
    </div>
  </div>
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
    },
    computed: {
      banners: {
        get() {
          return this.$store.state.config.banners
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    height: 330px;
  }
  .box-card {
    width: 800px;
    margin: 30px auto;
    position: relative;

    .el-form {
      margin-top: 30px;
    }

    .btn-warp {
      text-align: center;

      button {
        background-color: #cf0a2c;
        border-color: #a80824;
      }
    }
  }
</style>
