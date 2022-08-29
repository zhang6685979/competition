<template>
  <div>
    <el-card class="box-card">
      <h1 class="text-center">账号申请</h1>
      <p class="tit">请您填写基本信息，我们会尽快与您取得联系，谢谢！</p>
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading"
        :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
        <el-form-item label="您的姓名" prop="name" :rules="[
                    {required: true, message:'您的姓名不能为空', trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.name" placeholder="请填写您的姓名" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="company" :rules="[
                    {required: true, message:'单位名称不能为空', trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.company" placeholder="请填写单位名称" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="您的邮箱" prop="email" :rules="[
                    {required: true, message:'您的邮箱不能为空', trigger:'blur'},
                    {validator: validator.isEmail, trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.email" placeholder="请填写您的邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" :rules="[
                    {required: true, message:'手机号码不能为空', trigger:'blur'},
                    {validator: validator.isMobile, trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.mobile" placeholder="请填写手机号码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="inputForm.id?[]:[{required: true, message:'密码不能为空', trigger:'blur'}]">
            <el-input v-model="inputForm.password" maxlength="50" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
        <el-form-item label="确认密码" prop="confirmNewPassword" :rules="inputForm.id?[{validator: validatePass2, trigger: 'blur'}]:[{required: true, message:'确认密码不能为空', trigger:'blur'},{validator: validatePass2, trigger: 'blur'}]">
          <el-input v-model="inputForm.confirmNewPassword" maxlength="50" placeholder="再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone" :rules="[
                    {validator: validator.isTel, trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.telephone" placeholder="请填写联系电话"></el-input>
        </el-form-item>
        <el-form-item label="您的职务" prop="jobtitle" :rules="[
                   ]">
          <el-input v-model="inputForm.jobtitle" placeholder="请填写您的职务"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="address" :rules="[
                   ]">
          <el-input v-model="inputForm.address" placeholder="请填写单位地址"></el-input>
        </el-form-item>
        <div class="btn-warp">
          <el-button type="primary" @click="doSubmit">提交</el-button>
        </div>

      </el-form>
    </el-card>
  </div>
</template>

<script>
  import MemberService from '@/api/member/MemberService'
  export default {
    data() {
      return {
        title: '',
        method: '',
        loading: false,
        inputForm: {
          id: '',
          name: '',
          company: '',
          email: '',
          mobile: '',
          telephone: '',
          jobtitle: '',
          address: '',
          password: ''
        }
      }
    },
    components: {},
    memberService: null,
    created() {
      this.memberService = new MemberService()
    },
    methods: {
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.$confirm(`提交之后无法更改，确定要提交吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true
              this.memberService.register(this.inputForm).then(({
                data
              }) => {
                this.$refs.inputForm.resetFields();
                this.$message.success("账号申请成功!")
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            })

          }
        })
      },
      validatePass2  (rule, value, callback) {
        if (value !== this.inputForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  }
</script>
<style lang="scss" scoped="">
  h1 {
    font-size: 30px;
    text-align: center;
    font-weight: normal;
    margin: 0;
    line-height: 1.1;
    margin: 10px 20px;
  }

  h1:before {
    content: '';
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 10px;
    background: url('../assets/images/title.png');
    background-size: 100%;
    vertical-align: bottom;
  }

  .tit {
    text-align: center;
    margin: 20px 0;
    font-size: 15px;
    color: #666;
  }

  .box-card {
    width: 800px;
    margin: 30px auto;

    .btn-warp {
      text-align: center;
      button {
        background-color: #cf0a2c;
        border-color: #a80824;
      }
    }
  }
</style>
