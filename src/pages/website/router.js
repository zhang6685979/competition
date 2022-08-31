import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			name: 'index',
			component: () => import('./page/index.vue')
		},
    {
    		path: '/search',
    		name: 'search',
    		component: () => import('./page/search.vue')
    	},
		{
			path: '/news',
			name: 'news',
			component: () => import('./page/news.vue')
		},
    {
    	path: '/news/:id',
    	name: 'newsInfo',
    	component: () => import('./page/newsInfo.vue')
    },
    {
    	path: '/notice',
    	name: 'notice',
    	component: () => import('./page/notice.vue')
    },
    {
    	path: '/notice/:id',
    	name: 'noticeInfo',
    	component: () => import('./page/noticeInfo.vue')
    },
		{
			path: '/competitions',
			name: 'competitions',
			component: () => import('./page/competitions.vue')
		},
    {
    	path: '/competitions/:id',
    	name: 'competitionInfo',
      redirect: '/competition/:id/index',
    	component: () => import('./page/competitionInfo.vue'),
      children:[{
        path:'/competition/:id/index',
        name:'home',
        component: () => import('./page/competition/index.vue')
      },
      {
        path:'/competition/:id/signup',
        name:'competition-signup',
        component: () => import('./page/competition/signup.vue')
      },
      {
        path:'/competition/:id/style',
        name:'competition-style',
        component: () => import('./page/competition/style.vue')
      },
      {
        path:'/competition/:id/news',
        name:'competition-news',
        component: () => import('./page/competition/news.vue')
      },
      {
        path:'/competition/:id/queryScore',
        name:'competition-queryScore',
        component: () => import('./page/competition/queryScore.vue')
      },
      {
        path:'/competition/:id/live',
        name:'competition-live',
        component: () => import('./page/competition/live.vue')
      },
      {
        path:'/competition/:id/device',
        name:'competition-device',
        component: () => import('./page/competition/device.vue')
      },
      {
        path:'/competition/:id/notice',
        name:'competition-notice',
        component: () => import('./page/competition/notice.vue')
      },
      {
        path:'/competition/:id/download',
        name:'competition-download',
        component: () => import('./page/competition/download.vue')
      }]

    },
		{
			path: '/certificate',
			name: 'certificate',
			component: () => import('./page/certificate.vue')
		},
		{
			path: '/examination',
			name: 'examination',
			component: () => import('./page/examination.vue')
		},
		{
			path: '/suggestion',
			name: 'suggestion',
			component: () => import('./page/suggestion.vue')
		},
    {
    	path: '/login',
    	name: 'login',
    	component: () => import('./page/login.vue')
    },
    {
    	path: '/register',
    	name: 'register',
    	component: () => import('./page/register.vue')
    }
	]
})
