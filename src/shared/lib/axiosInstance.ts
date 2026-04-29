import axios from 'axios'

import { API_CONFIG } from './apiConfig'
import { useAuthStore } from '../stores/useAuthStore'

/**
 * 기본 axios 인스턴스
 * - baseURL: API_CONFIG.BASE_URL
 * - 기본 Content-Type: application/json
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 공개 가입/로그인 API는 익명 호출이어야 하는데, 스토어에 남은 JWT가 있으면
 * Authorization이 붙어 백엔드가 401을 내는 경우가 있어 제외합니다.
 */
function shouldOmitBearerAuth(url: string): boolean {
  const path = url.split('?')[0] ?? ''
  return (
    path === '/public/users/signup-session' ||
    path === '/public/users/signup' ||
    path === '/public/users/signup-social' ||
    path === '/public/users/login' ||
    path === '/public/users/login-social'
  )
}

/**
 * 요청 인터셉터: 인증 토큰이 존재하면 Authorization 헤더에 자동 첨부
 */
axiosInstance.interceptors.request.use(
  config => {
    const url = config.url ?? ''
    if (shouldOmitBearerAuth(url)) {
      delete config.headers.Authorization
      return config
    }
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default axiosInstance
