import HomePage from '../views/HomePage.vue'
import PlayGround from '../views/Playground.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

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
  history: createWebHashHistory('/whatsapp-chat-visualiser'),
  routes,
})

export default router
