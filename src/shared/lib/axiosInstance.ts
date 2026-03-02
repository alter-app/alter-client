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
 * 요청 인터셉터: 인증 토큰이 존재하면 Authorization 헤더에 자동 첨부
 */
axiosInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default axiosInstance
