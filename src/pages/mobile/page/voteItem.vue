<template>
  <div>
    <van-nav-bar :title="voteItem.name||'投票选项'" left-text="投票列表" :fixed="true" left-arrow @click-left="gotoList()" />
    <div class="main vote-content" :style="{'--color1': theme.color1,'--color2': theme.color2}">
      <div class="content-inner">
        <div class="line0">
          <img @click="previewImg(voteItem.image)" :src="voteItem.image" class="loading" />
        </div>
        <div class="line1">{{voteItem.name}}</div>
        <div class="line2">编号：{{voteItem.sid}}号</div>
        <!--图文begin-->
        <div class="article-box">
          <div class="article" v-html="voteItem.describe0">
          </div>
        </div>
        <!--图文END-->

        <template v-if="isStart && !isEnd">
          <div @click="doVote(voteItem.id)" v-if="!voteItem.voted" class="vote-btn">
            <div class="vote shadow">立即投票</div>
          </div>
          <div v-else class="vote-btn bt-grey light">
            <div class="vote shadow bg-grey light">{{vote.mode==0?'已投票':'今日已投'}}</div>
          </div>
        </template>
        <div v-else class="vote-btn bt-grey light">
          <div class="vote shadow bg-grey light">{{!isStart?'活动未开始':'活动已结束'}}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import ImagePreview from 'vant/lib/image-preview';
  import 'vant/lib/image-preview/style'
  export default {
    data() {
      return {
        voteItem: {},
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
        vote: {},
        theme: {}
      }
    },
    mounted() {
      var id = this.$route.params.id
      this.$http({
        url: '/vote/voteSubject/public/options/queryById',
        method: 'GET',
        params: {
          id
        }
      }).then(({
        data
      }) => {
        this.voteItem = data
        var vote = data.subjectDTO
        document.title = '请为'+data.name+'投票--'+vote.title
        this.vote = vote
        this.theme = this.themeList[vote.themeColor]
      })
    },
    methods: {
      previewImg(url) {
        ImagePreview([url]);
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
      doVote(id) {
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
          this.gotoList();
        })
      },
      gotoList(){
        this.$router.push('/vote/'+this.vote.id)
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
  .main {
    padding: 0 0;
    --mainColor: var(--color1);
    --mainColor2: var(--color2);
    background-image: linear-gradient(var(--mainColor), var(--mainColor2), var(--mainColor));
    min-height: 100vh;
  }

  .van-nav-bar {
    background: none;
  }

  ::v-deep .van-nav-bar__title,
  ::v-deep .van-nav-bar__text,
  ::v-deep .van-nav-bar .van-icon {
    color: #fff;
  }



  .vote-content {
    width: 100%;
    padding: 60px 10px 100px;
    display: flex;
    flex-direction: unset;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .vote-content .content-inner {
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    min-height: 250px;
  }

  .vote-content .content-inner .line0 {
    width: 100%;
    text-align: center;
    padding: 25px 0 0px;
  }

  .vote-content .content-inner .line0 img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .vote-content .content-inner .line1 {
    width: 100%;
    font-size: 18px;
    padding: 10px;
    color: #000;
    text-align: center;
  }

  .vote-content .content-inner .line2 {
    width: 100%;
    font-size: 14px;
    padding: 5px 10px;
    text-align: center;
    color: var(--mainColor);
    background-color: #f2f2f2;
  }

  .article-box {
    padding: 10px
  }

  .article-box .article {
    width: 100%;
    background-color: rgb(255, 255, 255, .8);
    border-radius: 5px;
  }

  .bg-grey {
    background-color: #aaaaaa !important;
  }

  .vote-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }

  .vote {
    width: 80%;
    padding: 5px;
    opacity: .8;
    margin-bottom: 8px;
    text-align: center;
    border-radius: 15px;
    background-color: var(--color1);
    color: #fff;
  }
</style>
