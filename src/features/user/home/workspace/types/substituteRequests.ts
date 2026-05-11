import type { CommonApiResponse } from '@/shared/types/common'

/** 대타 요청 생성 body — `POST /app/schedules/{scheduleId}/substitute-requests` */
export interface CreateSubstituteRequestBody {
  requestType: 'ALL' | 'SPECIFIC'
  targetId: number
  requestReason: string
}

export type CreateSubstituteRequestApiResponse = CommonApiResponse<
  Record<string, never>
>
