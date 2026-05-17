import type { CommonApiResponse } from '@/shared/types/common'

export type ResponseGetFixedWorkerSchdules = CommonApiResponse<{
  id: number
  workspaceWorkerId: number
  startDayofWeek: string
  startTime: string
  endDayOfWeek: string
  endTime: string
  status: string
}>

export type RequestPostFixedWorkerSchdules = {
  workspaceId: number
  schedules: {
    startDayOfWeek: string
    startTime: string
    endDayOfWeek: string
    endTime: string
  }
}

export type ResponsePostFixedWorkerSchdules = {
  timestamp?: string
  data?: object
  code?: string
}

export type ResponseDeleteFixedWorkerSchdules = {
  timestamp?: string
  data?: object
  code?: string
}

export type RequestPatchFixedWorkerSchdules = {
  startDayOfWeek: string
  startTime: string
  endDayOfWeek: string
  endTime: string
}
