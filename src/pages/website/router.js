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
			path: '/competitions',
			name: 'competitions',
			component: () => import('./page/competitions.vue')
		},
    {
    	path: '/competitions/:id',
    	name: 'competitionInfo',
    	component: () => import('./page/competitionInfo.vue')
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
