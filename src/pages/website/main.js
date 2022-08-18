import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import './assets/css/variables.scss'
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
import FormMake from '@/components/FormMake/index'
Vue.use(FormMake);
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
