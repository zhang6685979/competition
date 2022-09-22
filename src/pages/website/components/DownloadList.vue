<template>
  <ul class="el-upload-list el-upload-list--text">
    <li tabindex="0" class="el-upload-list__item" v-for="file in fileArra">
      <a class="el-upload-list__item-name" @click="downloadFile(file.url)"><i class="el-icon-document"></i> {{file.name}} </a>
    </li>
  </ul>
</template>

<script>
  export default {
    props:{
      value:{
        type:String,
        default:''
      }
    },
    data(){
      var fileArra = this.value.split('|').map((item) => {
        if (item.trim().length > 0) {
          return {
            name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
            url: item
          }
        }
      })
      return {
        fileArra:fileArra
      }
    },
    watch:{
      value:function(newVal){
        this.fileArra = [];
        newVal.split('|').forEach((item) => {
          if (item.trim().length > 0) {
            this.fileArra.push({
              name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)),
              url: item
            })
          }
        })
      }
    },
    methods:{
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

<style>
</style>
