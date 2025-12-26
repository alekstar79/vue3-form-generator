import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3FormGenerator',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.es.mjs'
        if (format === 'umd') return 'index.umd.js'
        return `vue3-form-generator.${format}.js`
      }
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'index.css'
          }
          return assetInfo.name || ''
        }
      }
    },
    copyPublicDir: false,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
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
      scss: {}
    }
  }
})
