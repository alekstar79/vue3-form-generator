import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'

import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'

export default defineConfig({
  publicDir: false,
  plugins: [
    vue(),
    dts({
      include: ['src'],
      outDir: 'lib',
      insertTypesEntry: true,
      exclude: '**/*.spec.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.ts', '.vue']
  },
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    lib: {
      name: 'Vue3FormGenerator',
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'es.js' : 'umd.cjs'}`,
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
      }
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        api: 'modern-compiler'
      }
    }
  }
})
