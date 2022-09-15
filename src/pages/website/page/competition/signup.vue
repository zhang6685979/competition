<template>
  <div class="signup-list">
    <el-row :gutter="20" v-if="!signFormVisible&&!mySignupVisible">
      <el-col :span="12" v-for="(item,index) in dataList" :key="index">
        <div class="signup-item" :style="{background:colors[index%5]}" @click="recordId = '';showSignupForm(item.id)">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>{{item.name}}</p>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="signup-item my-signup" @click="getMySignupList()">
          <img :src="require('../../assets/images/signup-form.png')" alt="">
          <p>我的报名</p>
        </div>
      </el-col>
    </el-row>
    <div class="signup-form" v-if="signFormVisible">
      <button class="btn" @click="signFormVisible=false">返 回</button>
      <div v-if="!memberName" class="login-tip">
        <p>您需要登录才能访问此页面！</p>
        <el-button type="primary" @click="toLogin">立即登录</el-button>
      </div>
      <template v-else>
        <h5>{{signupInfo.name}}</h5>
        <div class="signup-info">
          <table>
            <tr>
              <td>报名时间：</td>
              <td>{{signupInfo.starttime}}--{{signupInfo.endtime}}</td>
            </tr>
            <tr>
              <td>报名说明:</td>
              <td><pre>{{signupInfo.describe0}}</pre></td>
            </tr>
          </table>
        </div>
        <fm-generate-form style="margin: 0 auto;" insite="true" :edit="currItem.status!=1" v-if="json" :data="json"
          :value="{}" :remote="{}" ref="generateForm">
        </fm-generate-form>
        <div class="btn-warp" v-if="currItem.status!=1">
          <button class="btn btn-save" @click="save">保存</button>
        </div>
      </template>

    </div>

    <div v-if="mySignupVisible" class="mysignup-list">
      <button class="btn" @click="mySignupVisible=false">返 回</button>
      <div v-if="!memberName" class="login-tip">
        <p>您需要登录才能访问此页面！</p>
        <el-button type="primary" @click="toLogin">立即登录</el-button>
      </div>
      <table v-else>
        <tr>
          <td width="5%" align="center">#</td>
          <td width="45%">报名名称</td>
          <td height="30%">报名时间</td>
          <td width="15%">状态</td>
          <td width="10%">操作</td>
        </tr>
        <tr v-for="(item,index) in signupList" :key="index">
          <td align="center">{{index+1}}</td>
          <td>{{item.templateName}}</td>
          <td>{{item.createTime}}</td>
          <td class="status" :class="{'status-error':item.status==2}">{{status[item.status]}}</td>
          <td><a @click="reWrite(item)" :class="{disabled:item.status==1}">重新提报</a></td>
        </tr>
      </table>
    </div>



  </div>
</template>

<script>
  export default {
    data() {
      return {
        signFormVisible: false,
        mySignupVisible: false,
        dataList: [],
        json: '',
        signupInfo: {},
        colors: ['linear-gradient(180deg, #7DB3F9 0%, #4B6DF6 100%)',
          'linear-gradient(180deg, #7CD6BD 0%, #55B8CE 100%)', 'linear-gradient(180deg, #F09EBA 0%, #EC6085 100%)',
          'linear-gradient(180deg, #BAA4F8 0%, #7D67F3 100%)', 'linear-gradient(180deg, #96FCB1 0%, #24E52B 100%)'
        ],
        status: {
          0: '待审核',
          1: '报名成功',
          2: '审核不通过'
        },
        signupList: [],
        currItem: {} //当前信息填报信息
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
      showSignupForm(id, formData) {
        if (!this.memberName) {
          this.signFormVisible = true;
          return;
        }
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
          this.signupInfo = data;
          this.json = JSON.parse(data.content);
          this.$nextTick(() => {
            if (formData) {
              const $form = this.$refs.generateForm
              formData = JSON.parse(formData);
              $form.setData(formData);
            }
          })
        })
      },
      save() {
        const $form = this.$refs.generateForm
        $form.getData().then(data => {
          var signupName = this.signupInfo.name;
          if(signupName.indexOf('裁判报名')!=-1){
            data.signType = 'referee'
          }
          this.$http({
            url: '/competition/competitionSignup/forminput',
            method: 'post',
            headers: {
              isFront: 1, //是否是门户网站调用
              token: this.$cookie.get('user-token')
            },
            data: {
              tid:this.signupInfo.id,//模板id
              cid:this.$route.params.id, //大赛id
              id:this.recordId || '',
              content:data
            }
          }).then(({
            data
          }) => {
            this.$message.success('报名成功!');
            this.recordId = '';
            this.signFormVisible = false;
            this.getMySignupList();
          })
        }).catch(e => {
          this.$message.error(e)
        })
      },
      //获取我的报名列表
      getMySignupList() {
        if (!this.memberName) {
          this.mySignupVisible = true;
          return;
        }
        this.$http({
          url: '/competition/competitionSignup/forminput/list',
          headers: {
            isFront: 1, //是否是门户网站调用
            token: this.$cookie.get('user-token')
          },
          params: {
            'current': 1,
            'size': 100,
            'cid': this.$route.params.id
          }
        }).then(({
          data
        }) => {
          this.mySignupVisible = true;
          this.signupList = data.records;
        })
      },
      //重新填报
      reWrite(item) {
        var {
          tid,
          content,
          id
        } = item;
        this.currItem = item;
        this.mySignupVisible = false;
        this.signFormVisible = true;
        this.recordId = id; //报名记录id
        this.showSignupForm(tid, content)
      },
      toLogin(){
        var path = this.$route.path;
        this.$router.push('/login?redirect='+path)
      }
    },
    computed: {
      memberName: {
        get() {
          return this.$store.state.user.memberName
        }
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
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 20px;
    border-radius: 6px;

    p {
      margin-top: 10px;
      color: #fff;
    }
  }

  .signup-form {
    h5 {
      font-size: 32px;
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
      table{
        td{vertical-align: top;padding:5px 0;}
      }
    }

    .btn-warp {
      text-align: center;
      margin-top: 20px;
    }

    .btn {
      width: 120px;
      height: 45px;
      background: #FFFFFF;
      border: 1px solid #DC000C;
      font-size: 16px;
      color: #DC000C;
      cursor: pointer;
      margin-bottom: 20px;

      &.btn-save {
        background-color: #DC000C;
        color: #fff;
        margin-right: 15px;
      }
    }
  }
  .login-tip {
    text-align: center;
    padding: 40px;
    background: rgba(220, 0, 12, 0.07);

    .el-button {
      margin-top: 20px;
    }
  }

  .mysignup-list {
    .btn {
      width: 120px;
      height: 45px;
      background: #FFFFFF;
      border: 1px solid #DC000C;
      font-size: 16px;
      color: #DC000C;
      cursor: pointer;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;

      tr {
        &:first-child {
          background-color: #F5F5F5;
        }

        height:60px;

        td {
          border: 1px solid #dddddd;
          border-left: none;
          border-right: none;
          font-size: 18px;

          &.status {
            color: #44AF10;

            &.status-error {
              color: #f00
            }
          }

          a {
            color: #1890FF;
            font-size: 18px;
          }

          .disabled {
            color: #ccc;
          }
        }
      }
    }
  }

  .my-signup {
    background: linear-gradient(180deg, #F1F110 0%, #EBB218 100%);
  }
</style>
