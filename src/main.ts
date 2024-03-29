import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Quasar } from 'quasar'
import HighchartsVue from 'highcharts-vue'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import Highcharts from 'highcharts'
import { createPinia } from 'pinia'
import router from './router'

const pinia = createPinia()

Highcharts.setOptions({
  colors: ['#711DB0', '#C21292', '#EF4040', '#7360DF', '#3D30A2', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
})
createApp(App)
  .use(Quasar, {})
  // @ts-expect-error: Not sure how to fix...
  .use(HighchartsVue)
  .use(pinia)
  .use(router)
  .mount('#app')
