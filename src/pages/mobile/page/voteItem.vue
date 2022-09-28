<template>
  <div>
    <van-nav-bar title="详情" left-text="返回" :fixed="true" left-arrow @click-left="$emit('close')" />
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
      </div>
    </div>
  </div>

</template>

<script>
  import ImagePreview from 'vant/lib/image-preview';
  import 'vant/lib/image-preview/style'
  export default {
    props: {
      voteItem: {
        type: Object,
        default: {}
      },
      theme: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {}
    },
    methods:{
      previewImg(url){
       // ImagePreview([url]);
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
  .van-nav-bar{background: none;}
  ::v-deep .van-nav-bar__title,::v-deep .van-nav-bar__text,::v-deep .van-nav-bar .van-icon{color:#fff;}



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
</style>
