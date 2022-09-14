<template>
  <div>
    <img v-if="banners['certificate']" :src="banners['certificate']" alt="" class="banner">
    <div class="box-card">
      <el-row v-if="!infoVisible">
        <el-col :span="12">
          <div class="info-item" @click="showQuery('queryScore')">
            <img :src="require('../assets/images/score.png')" alt="">
            <div class="info-desc">
              <div class="left">
                <img :src="require('../assets/images/score-icon.png')" alt="">
              </div>
              <div class="right">
                <p>成绩查询</p>
                <span>通过姓名或身份证号对证书进行查询</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="info-item"  @click="showQuery('certificate')">
            <img :src="require('../assets/images/certificate.png')" alt="">
            <div class="info-desc">
              <div class="left">
                <img :src="require('../assets/images/certificate-icon.png')" alt="">
              </div>
              <div class="right">
                <p>证书查询</p>
                <span>通过姓名或身份证号对成绩进行查询</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="infoVisible">
        <button class="btn" @click="infoVisible=false">返 回</button>
        <component :is="comp"></component>
      </div>
    </div>
  </div>

</template>

<script>
  import certificate from './certificate'
  import queryScore from './competition/queryScore'
  export default {
    data() {
      return {
        comp:'certificate',
        infoVisible:false
      }
    },
    components: {
      certificate,
      queryScore
    },
    methods:{
      showQuery(comp){
        this.comp = comp;
        this.infoVisible = true;
      }
    },
    computed: {
      banners: {
        get() {
          return this.$store.state.config.banners
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    height: 330px;
  }

  .box-card {
    width: 80%;
    margin: 20px auto;

    .info-item {
      cursor: pointer;

      img {
        width: 670px;
        height: 380px;
        vertical-align: bottom;
        display: block;
        margin: 0 auto;
      }

      .info-desc {
        display: flex;
        width: 670px;
        margin: 0 auto;

        .left {
          width: 165px;
          height: 165px;
          line-height: 165px;
          text-align: center;
          background-color: #DC000C;

          img {
            width: 56px;
            height: 56px;
            display: inline-block;
            vertical-align: middle;
          }
        }

        .right {
          flex: 1;
          padding: 40px;
          background-color: #F6F7F8;

          p {
            font-size: 20px;
            width: 120px;
            border-bottom: 1px solid #C0C4CC;
            color: #000000;
            line-height: 36px;
            margin-bottom: 18px;
          }

          span {
            font-size: 14px;
            color: #707070;
            line-height: 22px;

          }
        }
      }
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
    }
  }
</style>
