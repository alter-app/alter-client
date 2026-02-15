interface FieldErrors {
  [key: string]: string
}

interface ErrorResponse {
  fieldErrors?: FieldErrors
  globalError?: string
  message?: string
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

    // 필드별 에러 처리
    if (typedData.fieldErrors && typeof typedData.fieldErrors === 'object') {
      Object.assign(fieldErrors, typedData.fieldErrors)
    }

    // 전역 에러 처리
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
