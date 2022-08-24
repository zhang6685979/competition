<template>
  <div id="#app">
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
    }
  }
</script>
