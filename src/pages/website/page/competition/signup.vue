<template>
  <div class="signup-list">
    <el-row :gutter="10" v-if="!signFormVisible">
      <el-col :span="6" v-for="(item,index) in dataList">
        <div class="signup-item" :style="{background:colors[index%3]}" @click="showSignupForm(item.id)">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>{{item.name}}</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="signup-item my-signup">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>我的报名</p>
        </div>
      </el-col>
    </el-row>
    <div class="signup-form" v-if="signFormVisible">
      <button class="btn" @click="signFormVisible=false">返 回</button>
      <h5>{{signupInfo.name}}</h5>
      <div class="signup-info">
        <table>
          <tr>
            <td>报名时间：</td>
            <td>{{signupInfo.starttime}}--{{signupInfo.endtime}}</td>
          </tr>
          <tr>
            <td>报名说明:</td>
            <td>{{signupInfo.describe0}}</td>
          </tr>
        </table>
      </div>

      <fm-generate-form  style="margin: 0 auto;" insite="true" v-if="json" :data="json" :value="{}" :remote="{}"
        ref="generateForm">
      </fm-generate-form>
      <div class="btn-warp">
        <button class="btn btn-save" @click="save">保存</button>
      </div>
    </div>



  </div>
</template>

<script>
  export default {
    data() {
      return {
        signFormVisible:false,
        dataList: [],
        json: '',
        signupInfo: {},
        colors: ['linear-gradient(180deg, #7DB3F9 0%, #4B6DF6 100%)',
          'linear-gradient(180deg, #7CD6BD 0%, #55B8CE 100%)', 'linear-gradient(180deg, #BAA4F8 0%, #7D67F3 100%)'
        ]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.$http({
          url: '/competition/competitionSignup/public/list',
          method: 'get',
          params: {
            'cid': this.$route.params.id
          }
        }).then(({
          data
        }) => {
          this.dataList = data.records
        })
      },
      showSignupForm(id) {
        this.$http({
          url: '/competition/competitionSignup/public/queryById',
          method: 'get',
          params: {
            id: id
          }
        }).then(({
          data
        }) => {
          this.signFormVisible = true;
          this.$nextTick(()=>{
            this.signupInfo = data;
            this.json = JSON.parse(data.content);
          })
        })
      },
      save(){
        const $form = this.$refs.generateForm

        $form.getData().then(data => {
          data.tid = this.signupInfo.id;//模板id
          data.cid = this.$route.params.id; //大赛id
          data.uid = 'abc';
          this.$http({
            url: '/competition/competitionSignup/forminput',
            method: 'post',
            data:data
          }).then(({data})=>{
            this.$message('报名成功!');
          })
        }).catch(e => {
          this.$message.error(e)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .signup-list {
    width: 80%;
    margin: 100px auto;
  }

  .signup-item {
    width: 100%;
    height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    p {
      margin-top: 10px;
      color: #fff;
    }
  }

  .signup-form {
    h5 {
      font-size: 18px;
      margin: 20px 0;
      text-align: center;
    }

    .signup-info {
      background: rgb(230 162 60 / 10%);
      padding: 30px;
      font-size: 16px;
      color: #303133;
      margin-bottom: 20px;

      p {
        margin: 10px 0;
      }
    }
    .btn-warp{text-align: center;margin-top: 20px;}
    .btn {
      width: 120px;
      height: 45px;
      background: #FFFFFF;
      border: 1px solid #DC000C;
      font-size: 16px;
      color: #DC000C;
      cursor: pointer;
      &.btn-save{
        background-color: #DC000C;
        color: #fff;
        margin-right: 15px;
      }
    }
  }


  .my-signup {
    background: linear-gradient(180deg, #F09EBA 0%, #EC6085 100%);
  }
</style>
