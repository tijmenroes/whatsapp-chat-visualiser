import HomePage from '../views/HomePage.vue'
import ScriptPage from '../views/ScriptPage.vue'
import FileScanned from '../views/FileScanned.vue'
import Highlights from '../views/HighlightsPage.vue'
import DashboardView from '../views/DashboardView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routeNames } from '../config/routeNames'
import { useStore } from '../store'

const routes = [
  {
    path: '/',
    name: routeNames.home,
    component: HomePage,
  },
  {
    path: '/select-file',
    name: routeNames.selectFile,
    component: () => import('../views/SelectFilePage.vue'),
  },
  {
    path: '/dashboard',
    name: routeNames.dashboard,
    component: DashboardView,
    meta: { requiresData: true },
    children: [
      {
        path: 'general',
        name: routeNames.dashboard_general,
        component: () => import('../views/dashboard/DashboardGeneral.vue'),
      },
      {
        path: 'dates',
        name: routeNames.dashboard_dates,
        component: () => import('../views/dashboard/DashboardDates.vue'),
      },
      {
        path: 'emojis',
        name: routeNames.dashboard_emojis,
        component: () => import('../views/dashboard/DashboardEmojis.vue'),
      },
      {
        path: 'words',
        name: routeNames.dashboard_words,
        component: () => import('../views/dashboard/DashboardWordFiltering.vue'),
      },
      {
        path: 'media',
        name: routeNames.dashboard_media,
        component: () => import('../views/dashboard/DashboardMedia.vue'),
      },
      {
        path: 'group',
        name: routeNames.dashboard_group,
        component: () => import('../views/dashboard/DashboardGroup.vue'),
      },
    ],
  },

  {
    path: '/file-scanned',
    name: routeNames.fileScanned,
    component: FileScanned,
  },
  {
    path: '/highlights',
    name: routeNames.highlights,
    component: Highlights,
  },
]
if (!import.meta.env.PROD) {
  routes.push({
    path: '/script',
    name: routeNames.script,
    component: ScriptPage,
  })
}

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach((to, _, next) => {
  const store = useStore()
  if (to.meta.requiresData && !store.authorsData.length && !import.meta.env.DEV) {
    next({ name: routeNames.home })
  } else {
    next()
  }
})

export default router
