// API 응답 형식 (CommonApiResponse<T>)
export interface CommonApiResponse<T> {
  timestamp: string
  data: T
}

export interface ErrorResponse {
  code?: string
  message?: string
}

export interface ApiError {
  data?: ErrorResponse
  message?: string
}
