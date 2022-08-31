<template>
  <div>
    <el-card class="box-card">
      <h1 class="text-center">用户登录</h1>
      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" label-width="0">
        <el-form-item label="" prop="username" :rules="[
                    {required: true, message:'请输入手机号或邮箱', trigger:'blur'}
                   ]">
          <el-input v-model="inputForm.username" autocomplete="off" placeholder="请输入手机号或邮箱" maxlength="250"></el-input>
        </el-form-item>

        <el-form-item label="" prop="password" :rules="[{required: true, message:'密码不能为空', trigger:'blur'}]">
          <el-input v-model="inputForm.password" autocomplete="off" maxlength="50" placeholder="请输入密码" show-password></el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 0;">
          <el-row :gutter="16">
            <el-col :span="16">
              <el-form-item prop="code">
                <el-input placeholder="请输入验证码" v-model="inputForm.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-image @click="getCaptcha" :src="captchaImg" style="height:32px"></el-image>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item >
          <a href="#/register">还没有账号？立即申请</a>
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
  import LoginService from '@/api/auth/LoginService'
  export default {
    data() {
      return {
        title: '',
        method: '',
        loading: false,
        captchaImg:'',
        inputForm: {
          uuid:'',
          username: '',
          password: '',
          code: ''
        }
      }
    },
    components: {},
    memberService: null,
    created() {
      this.memberService = new MemberService()
      this.loginService = new LoginService()
      this.getCaptcha();
    },
    methods: {
      // 表单提交
      doSubmit() {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.loginService.login(this.inputForm,1).then(({
              data
            }) => {
              this.$message.success("登录成功");
              this.$cookie.set('user-token', data.token);
              this.$store.commit('user/updateMember',data);
              this.$router.push('/')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.loginService.getCode().then(({data}) => {
          this.captchaImg = 'data:image/gif;base64,' + data.codeImg
          this.inputForm.uuid = data.uuid
        })
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
    margin-bottom: 30px;
  }

  .tit {
    text-align: center;
    margin: 20px 0 0;
    font-size: 15px;
    color: #666;
  }

  .box-card {
    width: 450px;
    margin: 30px auto;
    padding: 20px 50px;

    .btn-warp {
      text-align: center;

      button {
        background-color: #cf0a2c;
        border-color: #a80824;
        width: 100%;
      }
    }
  }
</style>
