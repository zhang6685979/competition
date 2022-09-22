<template>
  <el-dialog title="投票预览" :visible.sync="visible" fullscreen>
    <div class="preview-container">
      <div class="preview-layer">
        <div class="preview-bg">
          <div class="preview-phone">
            <iframe id="preview-html" :src="mobilePreviewUrl" class="preview-html" frameborder="0" name="preview-html"
              scrolling="auto" />
          </div>
        </div>
      </div>
      <div v-if="mobilePreviewUrl" class="qrcode-view">
        <p>手机扫码查看效果</p>
        <p class="text-danger">
          * 预览只能查看效果，无法提交数据
        </p>
        <vue-qr v-if="mobilePreviewUrl" :size="194" :text="mobilePreviewUrl" />
      </div>
    </div>
  </el-dialog>

</template>

<script>
  import VueQr from 'vue-qr'

  export default {
    name: 'PreView',
    components: {
      VueQr
    },
    data() {
      return {
        visible:false,
        mobilePreviewUrl: ''
      }
    },
    methods:{
      init(id){
        let url = window.location.protocol + '//' + window.location.host
        this.mobilePreviewUrl = `${url}/mobile.html#/vote/${id}?preview=true&loadData=true`
        this.visible = true;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .preview-container {
    margin: 0;
    height: 100vh;
    overflow: hidden !important;
    background-color: var(--color-bg);
    position: relative;
  }

  div.preview-layer {
    width: 500px;
    height: 100%;
    margin: 10px auto;
    right: 0;
    text-align: center;
  }

  div.preview-layer .preview-bg {
    width: 500px;
    height: 100%;
    margin: 20px auto;
    z-index: 999;
    opacity: 0.7;
  }

  div.preview-layer .preview-phone {
    width: 372px;
    height: 744px;
    background: url('~@/assets/images/appearset_bgc_big.png');
    background-size: 372px 744px;
    z-index: 1000;
  }

  .qrcode-view {
    position: absolute;
    top: 20px;
    right: 260px;

    p {
      text-align: center;
      font-size: 12px;
      color: #303133;
    }
  }

  .preview-html {
    width: 345px !important;
    height: 568px !important;
    margin: 74px 0 0;
    border-radius: 5px;
    outline: none;
    background-color: #fff;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    border-left-width: 0;
  }
</style>
