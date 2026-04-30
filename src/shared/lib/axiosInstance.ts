import axios from 'axios'

import { API_CONFIG } from './apiConfig'
import { useAuthStore } from '../stores/useAuthStore'

const baseConfig = {
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}

/** 로그인·회원가입 등 Bearer 없이 호출하는 공개 API용 */
export const publicInstance = axios.create(baseConfig)

/** 인증된 요청 — 스토어의 토큰이 있으면 Authorization 헤더 자동 첨부 */
export const authInstance = axios.create(baseConfig)

authInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default authInstance
