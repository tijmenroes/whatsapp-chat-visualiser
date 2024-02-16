import HomePage from '../views/HomePage.vue'
import PlayGround from '../views/Playground.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/playground',
    name: 'PlayGround',
    component: PlayGround,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
