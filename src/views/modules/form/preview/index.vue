<template>
  <div class="preview-container">
    <div class="preview-layer">
      <div class="preview-bg">
        <div class="preview-phone">
          <iframe id="preview-html" :src="mobilePreviewUrl" class="preview-html" frameborder="0" name="preview-html"
            scrolling="auto" />
        </div>
      </div>
    </div>
    <div v-if="mobilePreviewUrl&&previewQrcode" class="qrcode-view">
      <p>手机扫码查看效果</p>
      <p class="text-danger">
        * 预览只能查看效果，无法提交数据
      </p>
      <vue-qr v-if="mobilePreviewUrl&&previewQrcode"  class="qrcode"  :size="194" :text="mobilePreviewUrl" :callback="qrCodeGenSuccess"/>
      <a class="download-btn" @click="()=>{
                              this.downloadFile(`${title}.png`,this.qrCodeUrl)
                          }">请将此二维码保存并分享</a>
      <p class="text-center">《{{title}}》二维码</p>
    </div>
  </div>
</template>

<script>
  import VueQr from 'vue-qr'
  import mixin from '../TduckFormMixin'

  export default {
    name: 'PreView',
    components: {
      VueQr
    },
    mixins: [mixin],
    props: {
      previewQrcode: null,
      title:String
    },
    data() {
      return {
        formKey: null,
        mobilePreviewUrl: '',
        formConfig: {
          formKey: '',
          showBtns: true
        },
        qrCodeUrl:''
      }
    },
    mounted() {
      this.formKey = this.$route.query.key
      let url = window.location.protocol + '//' + window.location.host
      this.mobilePreviewUrl = `${url}/mobile.html#/project/form/view?key=${this.formKey}`
      this.$set(this.formConfig, 'formKey', this.formKey)
    },
    methods:{
      qrCodeGenSuccess(dataUrl) {
        this.qrCodeUrl = dataUrl
      },
      downloadFile(fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content) // new Blob([content]);
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)
        // aLink.dispatchEvent(evt);
        aLink.click()
      },
      // base64转blob
      base64ToBlob(code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {
          type: contentType
        })
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
    .qrcode {
      box-shadow: 0 0 5px #ccc;
    }

    .download-btn {
      display: block;
      text-align: center;
      margin: 10px;
      cursor: pointer;
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
