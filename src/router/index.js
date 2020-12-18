import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/website',
    name: 'Website',
    component: () => import(/* webpackChunkName: "about" */ '../views/Website.vue')
  },
  {
    path: '/editor',
    name: 'ImageEditorview',
    component: () => import(/* webpackChunkName: "about" */ '../views/ImageEditorview.vue')
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import(/* webpackChunkName: "about" */ '../views/Calculator.vue')
  },
  {
    path: '/personel',
    name: 'Personel',
    component: () => import(/* webpackChunkName: "about" */ '../views/Personel.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
