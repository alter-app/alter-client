import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
