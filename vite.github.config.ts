import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'

export default defineConfig({
  base: '/vue3-form-generator/',
  plugins: [vue()],
  build: {
    outDir: 'gh-pages',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        exports: 'named',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: {
          'vendor/vue': ['vue'],
          'vendor/vue-router': ['vue-router'],
          'vendor/pinia': ['pinia'],
        },
        chunkFileNames({ name }) {
          if (name.includes('vendor')) {
            return `${name}.js`
          }

          if (name.includes('_plugin-vue')) {
            return 'vue-plugin.js'
          }

          return '[name].js'
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
        silenceDeprecations: ['legacy-js-api'],
        api: 'modern-compiler',
      },
    },
  }
})
