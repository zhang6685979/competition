<template>
  <div>
    <p style="margin:0">{{options.downloadDesc}}</p>
    <el-button type="primary" @click="downloadFile"><i class="el-icon-download"></i>{{options.btnText}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'download',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    options:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      dataModel: this.value
    }
  },
  methods:{
    downloadFile() {
      var url = this.options.downloadUrl;
      var fileName = '模板文件';
      if(!url){
        this.$message.waring('模板文件不存在');
      }else{
        fileName = url.substring(url.lastIndexOf('/')+1);
      }
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
