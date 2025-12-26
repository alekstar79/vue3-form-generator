import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
