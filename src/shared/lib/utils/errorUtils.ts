// 백엔드 필드 에러 항목 (data 배열 형태)
interface FieldErrorItem {
  field: string
  message: string
}

interface FieldErrors {
  [key: string]: string
}

// 백엔드 에러 응답 형식
// { timestamp, code, message, data: [{field, message}, ...] }
interface ErrorResponse {
  code?: string
  message?: string
  data?: FieldErrorItem[] | Record<string, string>
  // 이전 방식 호환 (key-value 형태 fieldErrors)
  fieldErrors?: Record<string, string>
  globalError?: string
  error?: string
}

export function parseErrorResponse(data: unknown): {
  fieldErrors: FieldErrors
  globalError: string | null
} {
  const fieldErrors: FieldErrors = {}
  let globalError: string | null = null

  if (typeof data === 'object' && data !== null) {
    const typedData = data as ErrorResponse

    // 배열 형태: data: [{field: "...", message: "..."}, ...]
    if (Array.isArray(typedData.data)) {
      for (const item of typedData.data) {
        if (item.field && item.message) {
          fieldErrors[item.field] = item.message
        }
      }
    }
    // key-value 객체 형태: fieldErrors: { email: "...", ... }
    else if (
      typedData.fieldErrors &&
      typeof typedData.fieldErrors === 'object'
    ) {
      Object.assign(fieldErrors, typedData.fieldErrors)
    }

    // 전역 에러 메시지
    if (typedData.globalError) {
      globalError = String(typedData.globalError)
    } else if (typedData.message) {
      globalError = String(typedData.message)
    } else if (typedData.error) {
      globalError = String(typedData.error)
    }
  } else if (typeof data === 'string') {
    globalError = data
  }

  return { fieldErrors, globalError }
}
