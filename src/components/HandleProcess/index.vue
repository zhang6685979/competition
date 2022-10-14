<template>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="30%"
    >
        <p style="text-align: center; color: #a1a1a1;">{{ percentage >= 100 ? completeMessage : message }}</p>
        <el-progress :percentage="percentage" />
        <el-link v-if="downloadUrl" @click="downloadFile(downloadUrl)" type="primary">
            下载地址
        </el-link>
    </el-dialog>
</template>

<script>
export default {
    name: 'HandleProcess',
    props: {},
    data() {
        return {
            completeMessage: '已完成',
            message: '处理中',
            downloadUrl: '',
            key: '',
            timer: null,
            percentage: 0,
            dialogVisible: true
        }
    },
    created() {
        this.getHandleProcess()
        this.timer = setInterval(() => {
            this.getHandleProcess()
        }, 5000)
    },
    destroyed() {
        clearInterval(this.timer)
    },
    methods: {
        /**
         * 获取处理进去
         */
        getHandleProcess() {
            this.$api.get(`/common/process?key=${this.key}`).then(({data}) => {
                let {rate, url} = data.data
                if (rate) {
                    this.percentage = rate
                }
                if (url) {
                    this.downloadUrl = url
                    clearInterval(this.timer)
                }
            })
        },
        handleClose() {
            clearInterval(this.timer)
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
        },
        downloadFile(url) {
          var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
          const el = document.createElement('a');
          el.style.display = 'none';
          el.setAttribute('target', '_blank');
          /**
           * download的属性是HTML5新增的属性
           * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
           * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
           * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
           */
          fileName && el.setAttribute('download', fileName);
          el.href = url;
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        }
    }

}
</script>
