import type { CommonApiResponse } from '@/shared/types/common'

export interface ExchangeableWorkerDto {
  workerId: number
  workerName: string
}

export interface ExchangeableWorkersPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface ExchangeableWorkersPayload {
  page: ExchangeableWorkersPageDto
  data: ExchangeableWorkerDto[]
}

export type ExchangeableWorkersApiResponse =
  CommonApiResponse<ExchangeableWorkersPayload>
