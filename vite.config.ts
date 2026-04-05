/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    proxy: {
      // VITE_API_URL이 설정된 경우 axios가 직접 요청하므로 이 프록시는 사용되지 않음
      // 로컬 백엔드 서버를 직접 띄울 때만 활성화됨
      '/api': {
        target:
          process.env.VITE_API_URL?.replace('/api', '') ||
          'https://dev-api.alter-app.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    // 브라우저 커버리지: 리맵 후 exclude를 다시 적용해 CSS·정적 자산·Storybook preview 등을 리포트에서 제외
    coverage: {
      provider: 'v8',
      excludeAfterRemap: true,
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.mdx',
        'src/**/*.d.ts',
        'src/assets/**',
        'src/app/styles/**',
        'src/**/types/**',
        'storybook/**',
        '**/*.{css,png,jpg,jpeg,gif,webp,svg,ico}',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, 'storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
