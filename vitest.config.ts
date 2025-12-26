/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.ts', '.vue']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      resources: 'usable'
    },
    include: ['src/__tests__/**/*.{test,spec}.ts'],
    exclude: [
      '**/*.d.ts',
      'src/views/**',
      'src/router.ts',
      'src/types/**',
      'src/components/**/*.vue',
      'src/**/*.vue'
    ],

    pool: 'threads',
    maxConcurrency: 10,
    minWorkers: 1,
    maxWorkers: 4,
    isolate: true,
    vmMemoryLimit: '300Mb',

    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      include: [
        'src/**/*.{ts,js,vue}',
        'src/components/**/*.{ts,js,vue}',
        'src/utils/**/*.{ts,js}',
        'src/store/**/*.{ts,js}'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/types/**',
        'src/views/**',
        'src/router.ts',
        'node_modules/**'
      ]
    },

    snapshotFormat: {
      escapeStrings: false
    },

    mockResetTimer: true,
    clearMocks: true,
    restoreMocks: true,

    css: true,
    reporters: ['default', 'html'],
    outputFile: {
      html: './coverage/report.html'
    }
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
