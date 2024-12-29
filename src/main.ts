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
import './styles/main.scss'
import * as Sentry from '@sentry/vue'
import VueGtag from 'vue-gtag'
// import { VueReCaptcha } from 'vue-recaptcha-v3'
const pinia = createPinia()

Highcharts.setOptions({
  colors: ['#B18CFF', '#7DE7CE', '#5375FD', '#F58980', '#F9F680', '#FFCEA1', '#FFB3D4', '#80D2F5', '#6AF9C4'],
})
// hcHeatmap(Highcharts)
const app = createApp(App)

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: 'https://263a9dbedb1ad89dc1a320f3a9bb6af6@o4507299792879616.ingest.de.sentry.io/4507300727881808',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

app
  .use(Quasar, {})
  // @ts-expect-error: Not sure how to fix...
  .use(HighchartsVue)
  .use(pinia)
  .use(router)
  // .use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY, loaderOptions: { autoHideBadge: true } })
  .use(VueGtag, {
    config: { id: import.meta.env.VITE_GTAG_ID },
    enabled: import.meta.env.PROD,
  })
  .mount('#app')
