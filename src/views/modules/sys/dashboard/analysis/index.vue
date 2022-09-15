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
                <count-to :start-val="0" :end-val="basicInfo.competition" :duration="1000" class="card-panel-num" />
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
                <count-to :start-val="0" :end-val="basicInfo.news" :duration="2000" class="card-panel-num" />
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
                <count-to :start-val="0" :end-val="basicInfo.news" :duration="3000" class="card-panel-num" />
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
                <count-to :start-val="0" :end-val="basicInfo.announcement" class="card-panel-num" />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="m-3" :gutter="15">
          <el-col :span="18">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员列表</span>
              </div>
              <member-list ref="memberList" :readonly="true" style="height:240px;"></member-list>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="box-card" :body-style="{height:'280px'}">
              <div slot="header" class="clearfix">
                <span>用户信息</span>
              </div>
              <div class="user-info">
                <div class="left">
                  <el-image :src="userInfo.photo"></el-image>
                </div>
                <div class="right">
                  <p class="title">{{userInfo.name}}</p>
                  <p class="desc">您好，{{userInfo.loginName}}</p>
                  <p class="desc">邮箱：{{userInfo.email}}</p>
                  <p class="desc">手机号：{{userInfo.mobile}}</p>
                </div>
              </div>
              <el-divider></el-divider>
              <p>上次登录时间：{{userInfo.loginDate}}</p>
              <p>上次登录Ip地址：{{userInfo.loginIp}}</p>
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
            <el-card class="box-card" :body-style="{height:'440px'}">
              <div slot="header" class="clearfix">
                <span>留言信息</span>
                <div class="pull-right">
                  <el-link type="primary" @click="$router.push('/message/MessageBoardList')">查看更多</el-link>
                </div>
              </div>
              <div v-for="(item,index) in dataList" :key="index" class="item">
                <p>{{item.title}}</p>
                <span>{{item.createDate}}</span>
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
  import MemberList from '@/views/modules/member/MemberList'
  import MessageBoardService from '@/api/message/MessageBoardService'

  export default {
    name: 'Analysis',
    components: {
      CountTo,
      CompetitionTypeNum,
      MemberList
    },
    data() {
      return {
        userInfo: {
          "id": "1",
          "loginName": "",
          "name": "",
          "email": "",
          "phone": "",
          "mobile": "",
          "loginIp": "",
          "loginDate": "",
          "photo": "",
        },
        basicInfo: {
          "competition": 0,
          "player": 0,
          "news": 0,
          "announcement": 0
        },
        dataList: []
      }
    },
    userService: null,
    beforeCreate() {
      this.userService = new UserService()
      this.messageBoardService = new MessageBoardService()
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
      getUserInfo(userId) {
        this.userService.queryById(userId).then(({
          data
        }) => {
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
          this.basicInfo = this.recover(this.basicInfo, data);
        })
      },
      refreshMemberList() {
        this.$refs.memberList.refreshList();
      },
      refreshMessageList() {
        this.messageBoardService.list({
          'current': 1,
          'size': 10,
          'orders': [],
        }).then(({
          data
        }) => {
          this.dataList = data.records
        })
      },
    },
    mounted() {
      this.refreshMessageList();
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
    margin-bottom: 5px;
    border-bottom: 1px solid #C0C4CC;
    p {
      margin: 5px 0 2px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    span {
      color: #C0C4CC;
      display: inline-block;
      margin-bottom: 5px;
    }
  }

  .item:last-child {
    border: none;
  }

  .user-info {
    display: flex;
    font-size: 14px;

    .left {
      width: 60px;
    }

    .right {
      flex: 1;
      padding: 0 10px;

      .title {
        color: #409EFF;
        margin: 10px 0;
        text-align: left;
        font-size: 16px
      }

      .desc {
        margin: 10px 0;
      }
    }
  }

  .el-scrollbar__wrap {
    overflow: hidden auto !important;
  }
</style>
