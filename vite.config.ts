import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// import '@quasar/extras/material-icons/material-icons.css'
// import 'quasar/src/css/index.sass'

export default defineConfig({
  base: '/whatsapp-chat-visualiser/',

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  plugins: [
    vue({
      template: { transformAssetUrls },
    }), // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: './src/styles/variables.sass',
    }),
    sentryVitePlugin({
      org: 'school-fjp',
      project: 'whatsapp-visualiser',
    }),
  ],

  build: {
    sourcemap: true,
  },
})
