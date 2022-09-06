import Vue from 'vue'
import App from './App.vue'
import ElementUI,{Message} from 'element-ui';
import './assets/css/variables.scss'
import './assets/css/style.css'
import httpRequest from '@/utils/httpRequest'
import validator from '@/utils/validator'
import dictUtils from '@/utils/dictUtils'
import router from './router.js'
import FormMake from '@/components/FormMake/index'
import VueCookie from 'vue-cookie'
import store from '@/store'

import  "amfe-flexible";

Vue.config.productionTip = false
Vue.prototype.$http = httpRequest // ajax请求方法

Vue.prototype.$dictUtils = dictUtils

Vue.prototype.validator = validator
Vue.use(ElementUI);
import Download from '@/components/FormMake/components/Download/index'
import SignupTable from '@/components/FormMake/components/SignupTable/index'
Vue.use(FormMake, {
  components: [{
      name: 'download',
      component: Download
    },
    {
      name: 'signup-table',
      component: SignupTable
    }]
})

Vue.prototype.$message = Message;

Vue.use(VueCookie)
new Vue({
	router,
  store,
  render: h => h(App),
}).$mount('#app')
