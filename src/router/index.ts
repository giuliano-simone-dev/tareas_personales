import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import store from '@/store'

Vue.use(VueRouter)
Vue.use(Buefy)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../components/DashboardView.vue'),
    meta: { requiresAuth: true }
  }

]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLogged) {
    next('/');
    return;
  }
  next();
});

export default router
