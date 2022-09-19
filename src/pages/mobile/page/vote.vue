<template>
  <div>
    <img class="banner" :src="require('../assets/images/banner.png')" alt="">
    <div class="box-card">
      <el-row class="row">
        <el-col :span="8" class="number-card">
          561
          <p>投票人数</p>
        </el-col>
        <el-col :span="8" class="number-card">
          561
          <p>投票人数</p>
        </el-col>
        <el-col :span="8" class="number-card">
          561
          <p>投票人数</p>
        </el-col>
      </el-row>
      <div class="count-down">结束时间：<span>3天12小时32分9秒</span></div>
    </div>
    <div>
      <ul>
        <li class="active">投票</li>
        <li>排行榜</li>
        <li>介绍</li>
      </ul>
      <div class="voto-list">
        <div class="voto-item">
          <span class="serialNo">1号</span>
          <img :src="require('../assets/images/player.png')" class="item-img" alt="">
          <div class="item-info">
            <h5>参赛作品1</h5>
            <p>15票</p>
            <button>立即投票</button>
          </div>
        </div>
        <div class="voto-item">
          <span class="serialNo">2号</span>
          <img :src="require('../assets/images/player.png')" class="item-img" alt="">
          <div class="item-info">
            <h5>参赛作品1</h5>
            <p>15票</p>
            <button>立即投票</button>
          </div>
        </div>
        <div class="voto-item">
          <span class="serialNo">3号</span>
          <img :src="require('../assets/images/player.png')" class="item-img" alt="">
          <div class="item-info">
            <h5>参赛作品1</h5>
            <p>15票</p>
            <button>立即投票</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
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
      .serialNo{
        position: absolute;
        top: 0;
        right:10px;
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
