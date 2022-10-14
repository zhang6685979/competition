import TduckForm from '@/components/tduck-form/TduckForm.common'
import store from '@/store/index'
import {getCurrentDomain} from '@/utils'
import Vue from 'vue'

export default {
    data() {
        return {
            formKey: null,
            isRouterAlive:true
        }
    },
    created() {
    // 写入值到localStorage 给组件使用
        if (Vue.cookie&&Vue.cookie.get('token')) {
            localStorage.setItem(TduckForm.constant.ACCESS_TOKEN,  Vue.cookie.get('token'))
        }
        localStorage.setItem('FORM-SUPPORT', '')
        localStorage.setItem(TduckForm.constant.ACCESS_TOKEN_NAME, 'token')
        if (process.env['VUE_APP_API_ROOT']) {
            localStorage.setItem(TduckForm.constant.BASE_URL, process.env['VUE_APP_API_ROOT'])
        } else {
            localStorage.setItem(TduckForm.constant.BASE_URL, getCurrentDomain())
        }

    }
}
