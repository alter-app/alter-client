import type { CommonApiResponse } from '@/shared/types/common'

export interface CursorPageInfo {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface CursorPage<T> {
  page: CursorPageInfo
  data: T[]
}

export function unwrapCursorPage<T>(
  body: CursorPage<T> | CommonApiResponse<CursorPage<T>>
): CursorPage<T> {
  if (body && 'page' in body) return body
  return body.data
}
