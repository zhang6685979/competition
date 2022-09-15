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
import schoolSelect from '@/components/FormMake/components/SignupTable/schoolSelect'
import citySelect from '@/components/FormMake/components/SignupTable/citySelect'
Vue.use(FormMake, {
  components: [{
      name: 'download',
      component: Download
    },
    {
      name: 'signup-table',
      component: SignupTable
    },
    {
      name: 'school-select',
      component: schoolSelect
    },
    {
      name: 'city-select',
      component: citySelect
    }]
})

Vue.prototype.$message = Message;
Vue.prototype.$window = window

router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  next()
})

Vue.use(VueCookie)
new Vue({
	router,
  store,
  render: h => h(App),
}).$mount('#app')
