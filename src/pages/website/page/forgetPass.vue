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
         <div class="vertify-code">
           <el-input placeholder="请输入验证码" v-model="inputForm.code"></el-input>
           <el-button  class="ml20" @click="getCode" :disabled="isCountdown">{{isCountdown?time+'S':'获取验证码'}}</el-button>
         </div>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="vertifyCode"><i class="el-icon-success"></i> 确定
         </el-button>
       </el-form-item>
     </el-form>

       <el-form v-if="active==2" :model="inputForm" size="small" ref="inputForm" label-width="120px">
         <el-form-item label="密码" prop="password" key="password" :rules="[{required: true, message:'密码不能为空', trigger:'blur'}]">
             <el-input v-model="inputForm.password" maxlength="50" placeholder="请输入密码" show-password></el-input>
           </el-form-item>
         <el-form-item label="确认密码" prop="confirmNewPassword" key="confirmNewPassword" :rules="[{required: true, message:'确认密码不能为空', trigger:'blur'},{validator: validatePass2, trigger: 'blur'}]">
           <el-input v-model="inputForm.confirmNewPassword" maxlength="50" placeholder="再次输入密码" show-password></el-input>
         </el-form-item>

           <el-form-item>
           <el-button type="primary"  @click="updatePass"><i class="el-icon-success"></i> 确定
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
          id:'',
          password:'',
          confirmNewPassword:''
        },
        loading:false,
        isCountdown:false,
        time:60
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
              url:'/member/member/public/sendcode',
              method:'get',
              params:{email:this.inputForm.email}
            }).then(({data})=>{
               if(data.status){
                 this.isCountdown = true;
                 this.timer = setInterval(()=>{
                   this.time = this.time-1;
                   if(this.time==0){
                     this.isCountdown = false;
                     this.time = 60;
                     clearInterval(this.timer);
                   }
                 },1000)
               }
               this.$message.success(data.message);
            })
          }
        })
      },
      vertifyCode(){
        var $form = this.$refs.form;
        var {email,code} = this.inputForm;
        this.$refs['inputForm'].validate((valid) => {
          if(valid){
            if(!code){
              this.$message.warning('请输入验证码');
              return false;
            }
            this.$http({
              url:'/member/member/public/verificatincode',
              method:'post',
              params:{email,code}
            }).then(({data})=>{
               if(data.status){
                 this.inputForm.id = data.message;
                 this.active = this.active+1;
                 this.clearInterval(this.timer);
               }else{
                 this.$message.error(data.message);
               }
            })
          }
        })
      },
      updatePass(){
        var $form = this.$refs.form;
        var {password,id} = this.inputForm;
        this.$refs['inputForm'].validate((valid) => {
          if(valid){
            this.$http({
              url:'/member/member/public/updatepassword',
              method:'post',
              params:{id,password}
            }).then(({data})=>{
               if(data.status){
                 this.active = this.active+1;
                 setTimeout(()=>{
                   this.$router.push('/login')
                 },3000)
               }else{
                 this.$message.error(data.message);
               }
            })
          }
        })
      }
    },
    destroyed(){
      clearInterval(this.timer);
    }
  }
</script>

<style scoped lang="scss">
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
    width:120px;
  }

  .vertify-code{
    display:flex
  }

</style>
