import Vue from 'vue'
import App from './App.vue'
import httpRequest from '@/utils/httpRequest'
import dictUtils from '@/utils/dictUtils'
import router from './router.js'
import ElementUI,{Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss'

import { Popup,NavBar,Toast } from 'vant';
import 'vant/lib/popup/style';
import 'vant/lib/nav-bar/style';
import 'vant/lib/toast/style';
Vue.use(Popup);
Vue.use(NavBar);
Vue.use(Toast);

//import "amfe-flexible";

Vue.config.productionTip = false
Vue.prototype.$http = httpRequest // ajax请求方法

Vue.prototype.$dictUtils = dictUtils
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
