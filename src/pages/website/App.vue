<template>
  <div id="#app">
    <el-backtop :bottom="60"></el-backtop>
    <m-header></m-header>
    <router-view></router-view>
    <m-footer></m-footer>
  </div>
</template>

<script>
  import Header from './components/Header.vue'
  import Footer from './components/Footer.vue'
  export default {
	name: 'App',
    components: {
      'm-header': Header,
      'm-footer': Footer
    },
    created(){
      var member = localStorage.getItem('member');
      if(member){
        this.$store.commit('user/updateMember',JSON.parse(member))
      }
      this.$http({
        url:'/sys/sysConfig/public/banners',
        method:'get'
      }).then(({
        data
      }) => {
       this.$store.commit('config/updateBannerConfig', data);
      })
    }
  }
</script>
