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
        <li>投票</li>
        <li>排行榜</li>
        <li>介绍</li>
      </ul>
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
    margin-top: -70px;
    background: #fff;

    .count-down {
      background-color: #f5f5f5;
      height: 36px;
      line-height: 36px;
    }
  }
  ul{
        display: inline-block;
        margin: 20px auto;
        padding: 0;
        width: 100%;
    li{
      list-style: none;
      width: 33.33%;
      float: left;
      text-align: center;
    }
  }

  .number-card {
    text-align: center;
  }
</style>
