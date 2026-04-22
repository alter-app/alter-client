import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type { ApiError, ErrorResponse } from '@/shared/types/common'
import type {
  CalendarEvent,
  CalendarViewData,
  ScheduleApiResponse,
  ScheduleDataDto,
} from '@/features/home/user/schedule/types/schedule'
import {
  getDurationHours,
  toDateKey,
  toTimeLabel,
} from '@/features/home/user/schedule/lib/date'

export interface SelfScheduleQueryParams {
  year?: number
  month?: number
  day?: number
  fromYear?: number
  fromMonth?: number
  fromDay?: number
  toYear?: number
  toMonth?: number
  toDay?: number
}

function mapToCalendarEvent(
  data: ScheduleDataDto['schedules'][number]
): CalendarEvent {
  return {
    shiftId: data.shiftId,
    workspaceName: data.workspace.workspaceName,
    position: data.position,
    status: data.status,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime,
    dateKey: toDateKey(data.startDateTime),
    startTimeLabel: toTimeLabel(data.startDateTime),
    endTimeLabel: toTimeLabel(data.endDateTime),
    durationHours: getDurationHours(data.startDateTime, data.endDateTime),
  }
}

export function adaptScheduleResponse(
  response: ScheduleApiResponse
): CalendarViewData {
  return {
    summary: {
      totalWorkHours: response.data.totalWorkHours,
      eventCount: response.data.schedules.length,
    },
    events: response.data.schedules.map(mapToCalendarEvent),
  }
}

async function fetchScheduleByMonth(
  year?: number,
  month?: number,
  day?: number
): Promise<ScheduleApiResponse> {
  try {
    const response = await axiosInstance.get<ScheduleApiResponse>(
      '/app/schedules/self',
      {
        params: {
          ...(year !== undefined && { year }),
          ...(month !== undefined && { month }),
          ...(day !== undefined && { day }),
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      const message = errorData.message ?? '스케줄 조회 중 오류가 발생했습니다.'
      const apiError = new Error(message) as ApiError & Error
      apiError.data = errorData
      throw apiError
    }
    throw new Error('스케줄 조회 중 오류가 발생했습니다.')
  }
}

function mergeScheduleResponses(
  a: ScheduleApiResponse,
  b: ScheduleApiResponse
): ScheduleApiResponse {
  return {
    ...a,
    data: {
      totalWorkHours: a.data.totalWorkHours + b.data.totalWorkHours,
      schedules: [...a.data.schedules, ...b.data.schedules],
    },
  }
}

export async function getSelfSchedule(
  params?: SelfScheduleQueryParams
): Promise<ScheduleApiResponse> {
  if (params?.fromYear !== undefined) {
    const sameMonth =
      params.fromYear === params.toYear && params.fromMonth === params.toMonth
    if (sameMonth) {
      return fetchScheduleByMonth(params.fromYear, params.fromMonth)
    }
    const [fromData, toData] = await Promise.all([
      fetchScheduleByMonth(params.fromYear, params.fromMonth),
      fetchScheduleByMonth(params.toYear, params.toMonth),
    ])
    return mergeScheduleResponses(fromData, toData)
  }
  return fetchScheduleByMonth(params?.year, params?.month, params?.day)
}
