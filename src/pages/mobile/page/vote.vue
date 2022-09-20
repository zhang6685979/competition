<template>
  <div>
    <img class="banner" :src="voteInfo.image?voteInfo.image:require('../assets/images/banner.png')" alt="">
    <div class="box-card">
      <el-row class="row">
        <el-col :span="8" class="number-card">
          {{voteInfo.peoples||0}}
          <p>投票人数</p>
        </el-col>
        <el-col :span="8" class="number-card">
          {{voteInfo.votes||0}}
          <p>累计票数</p>
        </el-col>
        <el-col :span="8" class="number-card">
          {{voteInfo.views||0}}
          <p>访问量</p>
        </el-col>
      </el-row>
      <div class="count-down">结束时间：<span>{{time}}</span></div>
    </div>
    <div>
      <ul>
        <li class="active">投票</li>
        <li>排行榜</li>
        <li>介绍</li>
      </ul>
      <div class="voto-list">
        <div class="voto-item" v-for="(item,index) in voteInfo.options||[]">
          <span class="serialNo">{{index+1}}号</span>
          <img :src="item.image" class="item-img" alt="">
          <div class="item-info">
            <h5>{{item.name}}</h5>
            <p>0票</p>
            <button @click="vote(item.id)">立即投票</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        voteInfo: {},
        time:''
      }
    },
    mounted() {
      var id = this.$route.params.id;
      this.getVoteInfo(id);
    },
    methods: {
      getVoteInfo(id) {
        this.$http({
          url: '/vote/voteSubject/public/queryById',
          method: 'get',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          this.voteInfo = Object.assign({}, data);
          this.countDown(data.endtime);
          setInterval(()=>{
            this.countDown(data.endtime);
          },1000)
        })
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
        this.time = d + '天' +' '+ h + '时' +' '+ m + '分' +' '+ s + '秒';
      },
      vote(id){
        this.$http({
          url: '/vote/voteSubject/public/vote',
          method: 'POST',
          params: {
            id
          }
        }).then(({
          data
        }) => {
          debugger;
        })

      }
    }
  }
</script>

<style scoped lang="scss">
  .banner {
    width: 100%;
    height: 222px;
  }

  .box-card {
    text-align: center;
    position: relative;
    padding: 20px 10px;
    margin: -70px 10px 10px;
    background: #fff;
    border-radius: 5px;

    .count-down {
      background-color: #f5f5f5;
      height: 36px;
      line-height: 36px;
    }
  }

  ul {
    display: inline-block;
    margin: 20px auto;
    padding: 0;
    width: 100%;

    li {
      list-style: none;
      width: 33.33%;
      float: left;
      text-align: center;
      position: relative;
      padding: 10px 0;
      color: #707070;

      &.active {
        color: #1890FF;

        &:after {
          content: '';
          display: block;
          width: 30px;
          height: 3px;
          background-color: #1890FF;
          position: absolute;
          left: 50%;
          margin-left: -15px;
          bottom: 0;
        }
      }
    }
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

  .number-card {
    text-align: center;
  }
</style>
