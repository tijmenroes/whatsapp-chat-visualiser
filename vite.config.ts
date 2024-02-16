import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// import '@quasar/extras/material-icons/material-icons.css'
// import 'quasar/src/css/index.sass'


export default defineConfig({
  plugins: [
    vue({
      
      template: { transformAssetUrls }
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar()
    //   {
    //   sassVariables: 'src/styles/quasar-variables.sass'
    // }
  ]
})

