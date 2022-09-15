<template>
  <div class="container">
    <div class="main-title">找回密码</div>
    <div class=" password">
      <el-steps :active="active" finish-status="success">
        <el-step title="验证身份"></el-step>
        <el-step title="修改密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <h2 v-if="active!=3">为确认是你本人操作，请选择验证方式完成身份验证：</h2>

     <el-form v-if="active==1" :model="inputForm" size="small" ref="inputForm" v-loading="loading" @keyup.enter.native="" @submit.native.prevent label-width="120px">
       <el-form-item label="邮箱号码" prop="email" :rules="[
                   {required: true, message:'请输入邮箱', trigger:'blur'},
                   {validator: validator.isEmail, trigger:'blur'}
                  ]">
         <el-input v-model="inputForm.email" autocomplete="off" placeholder="请输入邮箱" maxlength="250"></el-input>
       </el-form-item>

       <el-form-item label="验证码">
         <el-row>
           <el-col :span="16">
              <el-input placeholder="请输入验证码" v-model="inputForm.code"></el-input>
           </el-col>
           <el-col :span="8">
             <el-button  class="ml20" @click="getCode">获取验证码</el-button>
           </el-col>
         </el-row>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="active++"><i class="el-icon-success"></i> 确定
         </el-button>
       </el-form-item>
     </el-form>

       <el-form v-if="active==2" :model="inputForm" size="small" ref="inputForm" v-loading="loading"
         :class="method==='view'?'readonly':''" :disabled="method==='view'" label-width="120px">
         <el-form-item label="密码" prop="password" :rules="inputForm.id?[]:[{required: true, message:'密码不能为空', trigger:'blur'}]">
             <el-input v-model="inputForm.password" maxlength="50" placeholder="请输入密码" show-password></el-input>
           </el-form-item>
         <el-form-item label="确认密码" prop="confirmNewPassword" :rules="inputForm.id?[{validator: validatePass2, trigger: 'blur'}]:[{required: true, message:'确认密码不能为空', trigger:'blur'},{validator: validatePass2, trigger: 'blur'}]">
           <el-input v-model="inputForm.confirmNewPassword" maxlength="50" placeholder="再次输入密码" show-password></el-input>
         </el-form-item>

           <el-form-item>
           <el-button type="primary"  @click="active++"><i class="el-icon-success"></i> 确定
           </el-button>
           </el-form-item>

       </el-form>

      <div class="pd-ok" v-if="active==3">
        <i class="el-icon-success"></i>
        <h1>修改成功</h1>
        <p>3秒后将跳转登录页面，<a @click="$router.push('/login')">现在跳转</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        active:1,
        inputForm:{
          email:'',
          code:'',
          password:''
        },
        loading:false
      }
    },
    methods:{
      validatePass2  (rule, value, callback) {
        if (value !== this.inputForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      getCode(){
        var $form = this.$refs.form;
        this.$refs['inputForm'].validate((valid) => {
          if(valid){
            this.$http({
              url:'/member/member/sendcode',
              method:'get',
              headers:{token:this.$cookie.get('user-token')},
              params:{email:this.inputForm.email}
            }).then(data=>{
              debugger;
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 1000px;
    margin: 20px auto;
    font-size: 14px;
  }

  .main-title {
    font-size: 30px;
    line-height: 18px;
    padding-left: 5px;
    margin-bottom: 30px;
    margin-top: 20px;
    text-align: center;
    font-weight: 700;
  }

  .password {
    padding: 50px 120px;
  }

  .password h2 {
    padding: 50px 0;
    font-size: 16px;
  }

  .pd-ok {
    text-align: center;
    padding-top: 100px;
  }

  .pd-ok i {
    font-size: 60px;
    color: #390;
  }

  .pd-ok h1 {
    font-size: 22px;
    margin: 20px 0 20px
  }

  .pd-ok p {
    padding-top: 20px;
  }

  .ml20 {
    margin-left: 20px;
  }

</style>
