import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/style.css'
import httpRequest from '@/utils/httpRequest'
Vue.prototype.$http = httpRequest // ajax请求方法
import dictUtils from '@/utils/dictUtils'
Vue.prototype.$dictUtils = dictUtils
import validator from '@/utils/validator'
Vue.prototype.validator = validator
Vue.use(ElementUI);
Vue.config.productionTip = false
import router from './router.js'
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
