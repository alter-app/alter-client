import type { ErrorResponse, FieldErrors } from '@/shared/types/common'

export function parseErrorResponse(data: unknown): {
  fieldErrors: FieldErrors
  globalError: string | null
} {
  const fieldErrors: FieldErrors = {}
  let globalError: string | null = null

  if (typeof data === 'object' && data !== null) {
    const typedData = data as ErrorResponse

    if (Array.isArray(typedData.data)) {
      for (const item of typedData.data) {
        if (item.field && item.message) {
          fieldErrors[item.field] = item.message
        }
      }
    } else if (
      typedData.fieldErrors &&
      typeof typedData.fieldErrors === 'object'
    ) {
      Object.assign(fieldErrors, typedData.fieldErrors)
    }

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
