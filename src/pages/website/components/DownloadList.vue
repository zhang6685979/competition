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
	     var fileName = decodeURIComponent(url.substring(url.lastIndexOf("/")+1))
	     this.$http.get(url)
	     .then(res => {
	         const blob = new Blob([res.data], {type: res.headers['content-type']});
	         const a = document.createElement("a");
	         const objectUrl = window.URL.createObjectURL(blob);
	         a.download = fileName;
	         a.href = objectUrl;
	         a.click();
	         window.URL.revokeObjectURL(objectUrl);
	         a.remove();
	     })
	   }
    }
  }
</script>

<style>
</style>
