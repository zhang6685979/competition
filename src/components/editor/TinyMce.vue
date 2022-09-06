<template>
  <div>
    <editor
      v-model="content"
      :api-key="apiKey"
      :init="initConfig"
    />
  </div>

</template>

<script>
import axios from 'axios'
import plugins from './plugins'
import toolbar from './toolbar'
import fontFormats from './fontFormats'
import Editor from '@tinymce/tinymce-vue'

const defaultConfig = {
  width: 1000,
  height: 600,
  menubar: true,
  language: 'zh_CN'
}

const apiKey = 'fzt0wgn2rzxitc2x9n2zo9ijui983b5hyure0nyl6fse8inb'

export default {
  name: 'TinyMce',
  components: {
    editor: Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {
        return {
          width: '100%',
          height: 600,
          menubar: false,
          language: 'zh_CN'
        }
      }
    }
  },
  data () {
    return {
      apiKey,
      content: '',
      initConfig: {
        //toolbar_drawer: "sliding",
        quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        plugins,
        toolbar,
        width: Object.assign(defaultConfig, this.config).width,
        height: Object.assign(defaultConfig, this.config).height,
        menubar: Object.assign(defaultConfig, this.config).menubar,
        language: Object.assign(defaultConfig, this.config).language,
        font_formats: fontFormats,
        images_upload_handler: async (blobInfo, successFun) => {
          const file = blobInfo.blob()
          const { url } = await this.uploadFile(file, 'image')
          successFun(url)
        },
        file_picker_types: 'media',
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'media') {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            const that = this // 为 Vue 构造函数中的 this，指向 Vue 实例对象
            input.onchange = async function () {
              const file = this.files[0] // 为 HTMLInputElement 构造函数中的 this，指向 input 实例对象
              const isValid = await that.validateVideo(file)

              if (isValid) {
                const { url } = await that.uploadFile(file, 'video')
                callback(url)
              } else {
                callback()
              }
            }

            input.click()
          }
        },
        video_template_callback: data => {
          return `<video width="745" height="420" controls="controls" src=${data.source} />`
        }
      }
    }
  },
  watch: {
    value: {
      handler (newValue) {
          this.content = newValue
      },
      immediate: true
    },
    content(newVal,oldVal){
      if(newVal!=oldVal){
        this.$emit('input',this.content)
      }
    }
  },
  mounted(){

  },
  methods: {
    /**
     * @description 获取富文本内容（注：供父组件调用）
     * @returns {string}
     */
    getContent () {
      return this.content
    },

    /**
     * @description 校验上传视频
     * @param {File} file - 要上传的文件
     * @returns {boolean}
     */
    async validateVideo (file) {
      const isMP4 = file.type === 'video/mp4'
      const isLt3M = file.size / 1024 / 1024 < 5

      if (!isMP4) {
        this.$message.error('上传视频必须为 MP4 格式！')

        return false
      }

      if (!isLt3M) {
        this.$message.error('上传视频大小限制 5M 以内！')

        return false
      }

      const duration = await this.getVideoDuration(file)
      if (duration > 60) {
        this.$message.error('上传视频时长不能超过 60 秒！')

        return false
      }

      return true
    },

    /**
     * @description 获取视频时长
     * @param {File} file - 要上传的文件
     * @returns {Promise<number>}
     */
    getVideoDuration (file) {
      return new Promise(resolve => {
        const videoElement = document.createElement('video')
        videoElement.src = URL.createObjectURL(file)

        videoElement.addEventListener('loadedmetadata', () => {
          resolve(videoElement.duration)
        })
      })
    },

    /**
     * @description 上传文件
     * @param {File} file - 要上传的文件
     * @param {string} folder - 所存放的文件夹
     * @returns {Object}
     */
    async uploadFile (file, folder = 'images') {
      const formData = new FormData()
      formData.append('file', file)
      // 注：此为调用后端上传接口，需根据实际情况进行调整
      const { data } = await this.$http({
        method: 'POST',
        url: '/sys/file/webupload/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return {
        url: data.url,
        name: file.name
      }
    }
  },
  destroyed(){
    console.log('我被销毁了')
  }
}
</script>
<style>
  .tox-silver-sink{
      z-index: 3000!important;
  }
</style>
