<template>
  <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" class="el-form" label-width="150px">
    <el-form-item label="请输入您的姓名" prop="name" :rules="[
            {required: true, message:'请输入姓名', trigger:'blur'}
           ]">
      <el-input v-model="inputForm.name" placeholder="请输入姓名"></el-input>
    </el-form-item>
    <el-form-item label="请输入身份证号" prop="mobile" :rules="[
            {required: true, message:'请输入身份证号', trigger:'blur'},
            {validator: validator.isCardId, trigger:'blur'}
           ]">
      <el-input v-model="inputForm.mobile" placeholder="请填写身份证号"></el-input>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="doSubmit" class="el-button">查 询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        inputForm: {
          name: '',
          cardNo: ''
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
  .el-form{
    width:500px;
    margin: 100px auto;
    .el-button{
      width:200px;
    }
  }
</style>
