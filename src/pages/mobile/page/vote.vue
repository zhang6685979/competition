<template>
  <div>
    <img class="banner" :src="require('../assets/images/banner.png')" alt="">
    <div class="box-card">
      <el-row>
        <el-col :span="8" class="number-card">
          561
          <p>投票人数</p>
        </el-col>
        <el-col :span="8"  class="number-card">
          561
          <p>投票人数</p>
        </el-col>
        <el-col :span="8"  class="number-card">
          561
          <p>投票人数</p>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
</script>

<style scoped>
  .banner{
    width: 100%;
    height:222px;
  }
  .box-card{
    background-color: #fff;
    padding:20px;
    text-align: center;
  }
  .number-card{
    text-align: center;
  }
</style>
