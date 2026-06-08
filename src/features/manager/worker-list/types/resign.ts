import type { CommonApiResponse } from '@/shared/types/common'

export type ResignWorkerResponse = CommonApiResponse<Record<string, never>>

export interface ResignWorkerParams {
  workspaceId: number
  workerId: number
}
