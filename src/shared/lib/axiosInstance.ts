import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from './apiConfig'
import { refreshAccessToken } from './refreshToken'
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
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
    return config
  },
  error => Promise.reject(error)
)

interface FailedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

authInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const isAuthTokenRequest = originalRequest.url?.includes('/auth/token')

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthTokenRequest
    ) {
      if (isRefreshing) {
        originalRequest._retry = true
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest._retry = true
            originalRequest.headers.Authorization = `Bearer ${token}`
            return authInstance(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = await refreshAccessToken()
        processQueue(null, token)
        originalRequest.headers.Authorization = `Bearer ${token}`
        return authInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default authInstance
