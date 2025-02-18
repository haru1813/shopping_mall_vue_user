import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '!': fileURLToPath(new URL('./src/views', import.meta.url))
    },
  },
  server: {
    allowedHosts: true,
  },
  // devServer:{
  //   port: 80,
  //   webSocketServer: false, //사용하지 않게 변경
  //   proxy : {
  //     '/' : {
  //       target : 'https://back1.haru.company',
  //       changeOrigin : true,
  //       ws : true
  //     }
  //   },
  //   liveReload: true,
  //   host : 'localhost',
  //   allowedHosts: "all",
  //   open : true,
  //   client : {
  //     // logging: 'log',
  //     overlay: true,
  //     webSocketURL: 'wss://localhost:8080/ws' // Add this
  //   },
  //   compress : true
  // }
})
