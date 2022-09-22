<template>
  <div class="vote-detail"
    :style="{'--color1': themeList[vote.themeColor]?themeList[vote.themeColor].color1:'','--color2': themeList[vote.themeColor]?themeList[vote.themeColor].color2:''}">
    <img class="banner" :src="vote.image?vote.image:require('../assets/images/banner.png')" alt="">
    <div class="vote-detail-inner">
      <div class="detail">
        <div class="info-bg"></div>
        <div class="info">
          <div class="line1">
            <div class="item">
              <span class="num">{{vote.peoples||0}}</span>
              <span class="desc">投票人数</span>
            </div>
            <div class="item">
              <span class="num">{{vote.votes||0}}</span>
              <span class="desc">累计票数</span>
            </div>
            <div class="item">
              <span class="num">{{vote.views||0}}</span>
              <span class="desc">访问量</span>
            </div>
          </div>
          <div class="line2" v-if="!isStart||!isEnd">
            <div class="left" v-if="isStart&&!isEnd">距离投票结束：</div>
            <div class="left text-red" v-if="!isStart&&!isEnd">距离投票开始：</div>
            <div class="time">
              <span class="text-orange">{{clock[0]}}</span><span class="mark">天</span>
              <span class="text-orange">{{clock[1]}}</span><span class="mark">小时</span>
              <span class="text-orange">{{clock[2]}}</span><span class="mark">分</span>
              <span class="text-orange">{{clock[3]}}</span><span class="mark">秒</span>
            </div>
          </div>
          <div class="line2" v-if="isStart&&isEnd">
            <div class="time">
              <span class="text-orange padding-xl text-xl">投票已结束</span>
            </div>
          </div>

        </div>

        <div class="search">
          <input style="flex:1" v-model="keyword" maxlength="15" class="phc" placeholder="输入标题/名称/编号查询" />
          <span v-if="keyword" @click="keyword=''" class="close el-icon-close"></span>
          <div @click="search" class="search-btn">搜 索</div>
        </div>

        <div class="menu">
          <div @click="showView='vote'" :class="showView=='vote'?'cur':''">投票</div>
          <div @click="showView='orderList'" :class="showView=='orderList'?'cur':''">排行榜</div>
          <div @click="showView='desc'" :class="showView=='desc'?'cur':''">简介须知</div>
        </div>

        <div class="data-list">

          <!--最新begin-->
          <div class="order-list" v-if="showView=='vote'">
            <div class="no-data" v-if="options.length==0">暂无匹配数据~</div>
            <div class="item" v-for="(item,index) in options" :key="index">
              <div class="item-inner">
                <div class="order shadow">{{item.sid}}号</div>
                <img :src="item.image" @click="currItem=item;showItem=true;" class="loading" alt="">
                <div class="line">
                  <span class="name content-cut-one">{{item.name}}</span>
                  <span class="num content-cut-one">{{item.votes||0}}票</span>
                </div>
                <template wx:if="isStart && !isEnd">
                  <div @click="doVote(item.id)" v-if="!item.voted" class="vote-btn">
                    <div class="vote shadow">立即投票</div>
                  </div>
                  <div v-else class="vote-btn bt-grey light">
                    <div class="vote shadow bg-grey light">{{vote.mode==0?'已投票':'今日已投'}}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <!--最新END-->

          <!--排行begin-->
          <div class="rank-list" v-if="showView=='orderList'">
            <div class="item">
              <div class="item-inner" v-for="(item,index) in orderList" :key="index">
                <div class="no"
                  :class="{'text-red':index==0,'text-orange':index==1,'text-yellow':index==2,'text-bold':index<=2}">
                  {{index+1}}
                </div>
                <div class="img">
                  <img :src="item.image" @click="currItem=item;showItem=true;" class="loading" />
                </div>
                <div class="line">
                  <span class="name content-cut-one">{{item.name}}</span>
                  <span class="num content-cut-one text-orange">编号：{{item.sid}}号</span>
                </div>
                <div class="end"><span class="text-orange">{{item.votes}}</span>票</div>
              </div>
            </div>
          </div>

          <!--图文begin-->
          <div class="article-box" v-if="showView=='desc'">
            <div class="article">
              <div v-if="(vote.describe0||'').length==0">暂无简介与须知~</div>
              <div class="content" v-html="vote.describe0">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="showItem" position="right" :style="{ width: '100%' }">
      <voteItem :voteItem="currItem" :theme="themeList[vote.themeColor]" @close="showItem=false"></voteItem>
    </van-popup>


  </div>
</template>

<script>
  import voteItem from './voteItem'
  export default {
    data() {
      return {
        id: '',
        vote: {},
        options: [],
        clock: [],
        keyword: '',
        showView: 'vote',
        showItem: false,
        currItem: {},
        orderList: [], //排行榜
        themeList: [{
            color1: '#347DFF',
            color2: '#A376FB'
          },
          {
            color1: '#c3272b',
            color2: '#827100'
          },
          {
            color1: '#21a675',
            color2: '#ffa400'
          },
          {
            color1: '#1685a9',
            color2: '#16a951'
          },
          {
            color1: '#75664d',
            color2: '#f2be45'
          },
          {
            color1: '#2e4e7e',
            color2: '#177cb0'
          },
          {
            color1: '#424c50',
            color2: '#20CE96'
          },
          {
            color1: '#c93756',
            color2: '#ffb3a7'
          },
          {
            color1: '#e54d42',
            color2: '#f37b1d'
          },
          {
            color1: '#0E9489',
            color2: '#8dc63f'
          },
          {
            color1: '#347DFF',
            color2: '#50BFFF'
          },
          {
            color1: '#6739b6',
            color2: '#9B7ACD'
          },
          {
            color1: '#9c26b0',
            color2: '#CF97D9'
          },
          {
            color1: '#e03997',
            color2: '#EF94C6'
          },
          {
            color1: '#a5673f',
            color2: '#CEAD97'
          },
          {
            color1: '#000000',
            color2: '#999999'
          }
        ],
        preview: false //预览模式
      }
    },
    components: {
      voteItem
    },
    mounted() {
      window.vm = this;
      this.id = this.$route.params.id;

      this.preview = this.$route.query.preview;
      var loadData = this.$route.query.loadData;
      if (this.id) {
        this.showResult();
        if(!this.preview||loadData){
          this.getVoteInfo();
        }
      }
    },
    methods: {
      getVoteInfo() {
        var id = this.id;
        this.$http({
          url: '/vote/voteSubject/public/queryById',
          method: 'get',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.initData(Object.assign({}, data));
        })
      },
      initData(vote) {
        this.vote = vote;
        this.options = vote.options;
        if (!this.id) {
          this.orderList = vote.options.map(opt => {
            opt.votes = 0;
            return opt;
          })
        }
        var isStart = this.isStart;
        if (!this.isStart){
          this.loadStart();
        }else if(!this.isEnd){
          this.loadEnd()
        }
      },
      loadStart() {
        this.timer = setInterval(() => {
          this.countDown(this.vote.starttime);
          if (this.isStart) {
            clearInterval(this.timer);
            this.loadEnd(end);
            return;
          }
        }, 1000);
      },
      loadEnd() {
        this.timer = setInterval(() => {
          this.countDown(this.vote.endtime);
          if (this.isEnd) {
            clearInterval(this.timer);
            return;
          }
        }, 1000);
      },
      search() {
        var options = this.vote.options;
        var keyword = this.keyword;
        var filterOpts = options.filter(opt => {
          return opt.sid.indexOf(keyword) != -1 || opt.name.indexOf(keyword) != -1
        })
        this.options = filterOpts;
      },
      //获取当前时间
      getNowTime() {
        var date = new Date();
        //年 getFullYear()：四位数字返回年份
        var year = date.getFullYear(); //getFullYear()代替getYear()
        //月 getMonth()：0 ~ 11
        var month = date.getMonth() + 1;
        //日 getDate()：(1 ~ 31)
        var day = date.getDate();
        //时 getHours()：(0 ~ 23)
        var hour = date.getHours();
        //分 getMinutes()： (0 ~ 59)
        var minute = date.getMinutes();
        //秒 getSeconds()：(0 ~ 59)
        var second = date.getSeconds();
        var time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) +
          ':' + this.addZero(minute) + ':' + this.addZero(second);
        return time;
      },
      //小于10的拼接上0字符串
      addZero(s) {
        return s < 10 ? ('0' + s) : s;
      },
      countDown(time) {
        var nowTime = +new Date();
        var inputTime = +new Date(time);
        var times = (inputTime - nowTime) / 1000;
        var d = parseInt(times / 60 / 60 / 24); // 计算天数
        d = d < 10 ? 0 + d : d;
        var h = parseInt(times / 60 / 60 % 24) // 计算小时
        h = h < 10 ? 0 + h : h;
        var m = parseInt(times / 60 % 60); // 计算分数
        m = m < 10 ? 0 + m : m;
        var s = parseInt(times % 60); // 计算当前秒数
        s = s < 10 ? 0 + s : s;
        this.clock = [d, h, m, s]
      },
      showResult() {
        var id = this.id;
        this.$http({
          url: '/vote/voteSubject/public/result',
          method: 'get',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.orderList = data;
        })
      },
      doVote(id) {
        if (this.preview) {
          this.$toast('预览模式下不能进行投票!');
          return false;
        }
        this.$http({
          url: '/vote/voteSubject/public/vote',
          method: 'POST',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.$toast(data);
          this.getVoteInfo();
        })

      }
    },
    computed: {
      isStart: function() {
        let now = this.getNowTime();
        let start = this.vote.starttime;
        return now >= start;
      },
      isEnd: function() {
        let now = this.getNowTime();
        let end = this.vote.endtime;
        return now > end;
      }
    }
  }
</script>

<style scoped lang="scss">
  $mainColor:var(--color1);
  $mainColor2:var(--color2);

  .content-cut-one {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .text-red {
    color: #e54d42 !important;
  }

  .text-yellow {
    color: #fbbd08 !important;
  }

  .text-orange {
    color: #f37b1d !important;
  }

  .bg-grey {
    background-color: #aaaaaa !important;
  }

  .text-bold {
    font-weight: bold !important;
  }

  .vote-detail {
    background-image: linear-gradient($mainColor, $mainColor2, $mainColor);
    height: 100%;
    overflow: auto;
  }

  .banner {
    width: 100%;
    height: 200px;
  }

  .vote-detail .vote-detail-inner {
    width: 100%;
  }

  .vote-detail .vote-detail-inner .detail {
    width: 100%;
    padding: 0 10px 10px;
    margin-top: -20px;
    z-index: 200;
    position: relative;
  }

  .vote-detail .vote-detail-inner .detail .info-bg {
    width: 90%;
    height: 15px;
    background-color: rgb(255, 255, 255, .5);
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
  }

  .vote-detail .vote-detail-inner .detail .info {
    width: 100%;
    background-color: #fff;
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    z-index: 300;
  }

  .vote-detail .vote-detail-inner .detail .info .line1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .vote-detail .vote-detail-inner .detail .info .line1 .item {
    width: 33.3%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .vote-detail .vote-detail-inner .detail .info .line1 .item .num {
    font-size: 25px;
    color: #EB607D;
    margin-bottom: 5px;
  }

  .vote-detail .vote-detail-inner .detail .info .line1 .item .desc {
    font-size: 15px;
    color: #666;
  }

  .vote-detail .vote-detail-inner .detail .info .line2 {
    margin-top: 35px;
    width: 100%;
    font-size: 16px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vote-detail .vote-detail-inner .detail .info .line2 .left {
    color: #000;
    white-space: nowrap;
  }

  .vote-detail .vote-detail-inner .detail .info .line2 .time {
    padding: 5px 10px;
    background-color: #FFE4D5;
    white-space: nowrap;
  }

  .vote-detail .vote-detail-inner .detail .info .line2 .time .mark {
    margin-right: 5px;
  }

  .vote-detail .vote-detail-inner .detail .search {
    width: 100%;
    font-size: 15px;
    background-color: rgb(255, 255, 255, .2);
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px;
    border-radius: 5px;
    position: relative;
  }

  .vote-detail .vote-detail-inner .detail .search .phc {
    background: none;
    border: none;
    height: 30px;
    outline: none;
    color: #fff;

    &::placeholder {
      color: #fff;
      opacity: .8;
    }
  }

  .vote-detail .vote-detail-inner .detail .search .search-btn {
    font-size: 15px;
    color: #fff;
    padding: 5px 22px;
    background-color: rgba(255, 255, 255, .2);
    border-radius: 5px;
  }

  .vote-detail .vote-detail-inner .detail .search .close {
    font-size: 18px;
    color: #f2f2f2;
    width: 40px;
    text-align: center;
  }


  .vote-detail .vote-detail-inner .detail .menu {
    width: 100%;
    font-size: 17px;
    height: 40px;
    line-height: 40px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
  }

  .vote-detail .vote-detail-inner .detail .menu>div {
    color: #fff;
    opacity: .8;
  }

  .vote-detail .vote-detail-inner .detail .menu>div.cur {
    opacity: 1;
    font-weight: bold;
    position: relative;
  }

  .vote-detail .vote-detail-inner .detail .menu>div.cur::after {
    content: " ";
    position: absolute;
    left: 50%;
    bottom: 0px;
    width: 50%;
    height: 3px;
    border-radius: 1px;
    background-color: #fff;
    transform: translateX(-50%)
  }

  .vote-detail .data-list {
    width: 100%;
    min-height: 400px;
  }

  .vote-detail .order-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .vote-detail .order-list .item {
    width: 50%;
    padding: 5px;
  }

  .vote-detail .order-list .no-data {
    width: 100%;
    font-size: 15px;
    color: #fff;
    text-align: center;
  }

  .vote-detail .order-list .item .item-inner {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }

  .vote-detail .order-list .item .item-inner .order {
    top: 0;
    left: 0;
    position: absolute;
    z-index: 100;
    font-size: 15px;
    background-color: $mainColor2;
    opacity: .9;
    color: #fff;
    padding: 1px 5px 4px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .vote-detail .order-list .item .item-inner img {
    width: 100%;
    height: 175px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .vote-detail .order-list .item .item-inner .line {
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
  }

  .vote-detail .order-list .item .item-inner .line .name {
    flex: 1;
  }

  .vote-detail .order-list .item .item-inner .line .num {
    color: #777;
    max-width: 50px;
  }

  .vote-detail .order-list .item .item-inner .vote-btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .vote-detail .order-list .item .item-inner .vote {
    width: 80%;
    padding: 5px;
    opacity: .8;
    margin-bottom: 8px;
    text-align: center;
    border-radius: 15px;
    background-color: $mainColor;
    color: #fff;
  }


  .voto-list {
    display: flex;
    flex-flow: wrap;

    .voto-item {
      width: 50%;
      padding: 0 10px 10px;
      position: relative;

      .serialNo {
        position: absolute;
        top: 0;
        right: 10px;
        display: block;
        width: 50px;
        height: 30px;
        line-height: 30px;
        background: rgb(7 4 0 / 70%);
        border-radius: 0px 4px 0px 17px;
        opacity: 0.7;
        font-size: 14px;
        color: #fff;
        text-align: center;
      }

      .item-img {
        width: 100%;
        height: 90px;
        display: block;
      }

      .item-info {
        background-color: #fff;
        padding: 10px;

        h5 {
          font-size: 14px;
          font-weight: 400;
          color: #303133;
          margin: 0;
        }

        p {
          font-size: 14px;
          font-weight: 400;
          color: #707070;
          margin-top: 10px;
        }

        button {
          background-color: #1890FF;
          border: none;
          color: #fff;
          width: 100%;
          border-radius: 4px;
          padding: 5px;
        }
      }

    }
  }

  .vote-detail .rank-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
  }


  .vote-detail .rank-list .item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255, .8);
    border-radius: 5px;
    padding: 15px;
  }

  .vote-detail .rank-list .item .item-inner {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }


  .vote-detail .rank-list .item .item-inner .no {
    width: 25px;
    text-align: center;
    margin-right: 5px;
    font-size: 16px;
  }

  .vote-detail .rank-list .item .item-inner .img {
    border-radius: 50%;
    padding: 5px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vote-detail .rank-list .item .item-inner .img img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .vote-detail .rank-list .item .item-inner .line {
    flex: 1;
    padding: 0 10px;
  }

  .vote-detail .rank-list .item .item-inner .line .name {
    font-size: 16px;
    font-weight: bold;
    display: block;
  }

  .vote-detail .rank-list .item .item-inner .line .num {
    font-size: 14px;
    margin-top: 5px;
  }

  .vote-detail .rank-list .item .item-inner .end {
    width: 60px;
    font-size: 16px;
    text-align: right;
  }

  .article-box {
    padding: 10px;

    .article {
      width: 100%;
      background-color: rgb(255, 255, 255, .8);
      border-radius: 5px;

      .content {
        padding: 10px;
        word-break: break-all;
        word-wrap: break-word;
      }
    }
  }

  .number-card {
    text-align: center;
  }
</style>
