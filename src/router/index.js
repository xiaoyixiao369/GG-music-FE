import Vue from 'vue'
import Router from 'vue-router'
import Song from '@/components/Song'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'App',
      component: List
    }, {
      path: '/song',
      name: 'Song',
      component: Song
    }
  ]
})
