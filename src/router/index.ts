import HomePage from '../views/HomePage.vue'
import PlayGround from '../views/PlaygroundPage.vue'
import ScriptPage from '../views/ScriptPage.vue'
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
  {
    path: '/script',
    name: 'ScriptPage',
    component: ScriptPage,
  },
]

const router = createRouter({
  history: createWebHashHistory('/whatsapp-chat-visualiser'),
  routes,
})

export default router
