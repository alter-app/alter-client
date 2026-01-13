/**
 * API 설정
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/api/ws-connect',
} as const

