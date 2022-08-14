<template>
  <div class="el-scrollbar__wrap">
    <div class="el-scrollbar__view">
      <div class="analyze">
        <el-row :gutter="15" class="m-3">
          <el-col :span="6">
            <div class="card-panel panel1">
              <div class="card-panel-icon-wrapper icon-location">
                <el-image :src="require('@/assets/img/icon1.png')"></el-image>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  比赛数量
                </div>
                <count-to :start-val="0" :end-val="basicInfo.competition" :duration="1000"
                  class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-panel panel2">
              <div class="card-panel-icon-wrapper icon-sell">
                <el-image :src="require('@/assets/img/icon2.png')"></el-image>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  报名人数
                </div>
                <count-to :start-val="0" :end-val="basicInfo.news" :duration="2000"
                  class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-panel panel3">
              <div class="card-panel-icon-wrapper icon-visit">
                <el-image :src="require('@/assets/img/icon3.png')"></el-image>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  新闻数量
                </div>
                <count-to :start-val="0" :end-val="basicInfo.news" :duration="3000"
                  class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="card-panel panel4">
              <div class="card-panel-icon-wrapper icon-people">
                <el-image :src="require('@/assets/img/icon4.png')"></el-image>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  公告数量
                </div>
                <count-to :start-val="0" :end-val="basicInfo.announcement"
                  class="card-panel-num" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="m-3" :gutter="15">
          <el-col :span="18">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员列表</span>
                <div style="float: right; padding: 3px 0" type="text">操作按钮</div>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>用户信息</span>
              </div>
              <div class="user-info">
                <div class="left">
                  <el-image :src="require('@/assets/img/avatar.png')"></el-image>
                </div>
                <div class="right">
                  <p class="title">{{userInfo.name}}</p>
                  <p class="desc">您好，{{userInfo.loginName}}</p>
                </div>
              </div>
              <el-divider></el-divider>
              <p>上次登录时间：2022-08-13 00:00:00</p>
              <p>上次登录Ip地址：192.168.1.1</p>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="m-3" :gutter="15">
          <el-col :span="18">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>比赛分类统计</span>
              </div>
              <CompetitionTypeNum></CompetitionTypeNum>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>留言信息</span>
              </div>
              <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import CompetitionTypeNum from './CompetitionTypeNum'
  import UserService from '@/api/sys/UserService'

  export default {
    name: 'Analysis',
    components: {
      CountTo,
      CompetitionTypeNum
    },
    data() {

      return {
        userInfo: {"id":"1","loginName":"admin","name":"管理员","no":"1","companyDTO":{"id":"2f0a0b8d0b2745bab97c4c13cedd59af","children":[],"name":"风行软件公司","disabled":false,"parentId":"0"},"officeDTO":{"id":"6bc43c2a6cd44550a011bd160b78d92d","children":[],"parentIds":"0,2f0a0b8d0b2745bab97c4c13cedd59af,","name":"行政部","disabled":false,"parentId":"0"},"email":"11111@qq.com","phone":"025-83655913","mobile":"18951655371","loginIp":"172.31.1.138","loginDate":"2022-08-14 00:14:25","loginFlag":"1","photo":"/userfiles/1/程序附件/sys/user/images/截屏2021-07-21 下午3.04.22.png","sign":"个人签名","remarks":"大家好11111","roleIdList":["1418249908753821697"],"admin":true,"postIdList":[],"roleNames":"44","roleIds":"1418249908753821697"},
        basicInfo: {
          "competition": 0,
          "player": 0,
          "news": 0,
          "announcement": 0
        }
      }
    },
    userService: null,
    beforeCreate () {
      this.userService = new UserService()
      this.logService = new LogService()
    },
    watch: {
      '$store.state.user.id': {
        handler(userId) {
          if (userId) {
           this.getUserInfo(userId);
          }
        },

        immediate: true,
        deep: false
      }
    },
    methods: {
      getUserInfo(userId){
        this.userService.queryById(userId).then(({data}) => {
          this.userInfo = this.recover(this.userInfo, data);
        })
      },
      getStatiscInfo() {
        this.$http({
          url: '/statistics/baseInfo',
          method: 'get'
        }).then(({
          data
        }) => {
          this.basicInfo = this.recover(this.basicInfo,data);
        })
      }
    },
    mounted() {
      this.getStatiscInfo()
    }
  }
</script>

<style scoped lang="less">
  .analyze {

    .top-1 {
      top: 0.55rem;
    }

    .mt-0 {
      margin-top: 0;
    }

    .m-3 {
      margin-bottom: 0.75rem;
    }

    .right-0 {
      right: 200px;
    }

    .absolute {
      position: absolute;
    }

    .float-left {
      float: left;
    }

    .flex {
      display: flex;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: #fff;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  .panel1 {
    background: linear-gradient(180deg, #FD7871 0%, #FE5858 100%) !important;
  }

  .panel2 {
    background: linear-gradient(180deg, #FFBC6E 0%, #FFA238 100%) !important;
  }

  .panel3 {
    background: linear-gradient(180deg, #678DFC 0%, #4A78FF 100%) !important;
  }

  .panel4 {
    background: linear-gradient(180deg, #15CD1F 0%, #01BB00 100%) !important;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .user-info{
    display: flex;
    font-size:14px;
    .left{width:60px;}
    .right{
      flex:1;
      padding:0 10px;
      .title{color:#409EFF;margin:10px 0;text-align: left;font-size:16px}
      .desc{margin: 10px 0;}
    }
  }
</style>
