// API 응답 형식 (CommonApiResponse<T>)
export interface CommonApiResponse<T> {
  timestamp: string
  data: T
}

export interface FieldErrorItem {
  field: string
  message: string
}

export type FieldErrors = Record<string, string>

export interface ErrorResponse {
  code?: string
  message?: string
  data?: FieldErrorItem[] | Record<string, string>
  fieldErrors?: Record<string, string>
  globalError?: string
  error?: string
}

export interface ApiError {
  data?: ErrorResponse
  message?: string
}
