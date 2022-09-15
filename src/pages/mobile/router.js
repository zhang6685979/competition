import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 开发环境不使用懒加载
const _import = require('../../router/import-' + process.env.NODE_ENV)

export default new Router({
  routes: [{
      path: '/project/form/view',
      component: _import('modules/form/preview/ProjectForm')
    },
    {
      path: '/s/:key',
      component: _import('modules/form/write/index')
    }
  ]
})
