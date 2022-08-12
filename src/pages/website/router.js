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
			path: '/competitions',
			name: 'competitions',
			component: () => import('./page/competitions.vue')
		},
		{
			path: '/credentials',
			name: 'credentials',
			component: () => import('./page/credentials.vue')
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
		}
	]
})
