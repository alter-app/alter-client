interface FieldErrors {
  [key: string]: string
}

interface ErrorResponse {
  fieldErrors?: FieldErrors
  globalError?: string
  message?: string
}

export function parseErrorResponse(data: any): {
  fieldErrors: FieldErrors
  globalError: string | null
} {
  const fieldErrors: FieldErrors = {}
  let globalError: string | null = null

  if (typeof data === 'object' && data !== null) {
    // 필드별 에러 처리
    if (data.fieldErrors && typeof data.fieldErrors === 'object') {
      Object.assign(fieldErrors, data.fieldErrors)
    }

    // 전역 에러 처리
    if (data.globalError) {
      globalError = String(data.globalError)
    } else if (data.message) {
      globalError = String(data.message)
    } else if (data.error) {
      globalError = String(data.error)
    }
  } else if (typeof data === 'string') {
    globalError = data
  }

  return { fieldErrors, globalError }
}

