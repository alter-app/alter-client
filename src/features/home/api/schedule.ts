import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type { ApiError, ErrorResponse } from '@/shared/types/common'
import type {
  CalendarEvent,
  CalendarViewData,
  ScheduleApiResponse,
  ScheduleDataDto,
} from '@/features/home/types/schedule'
import {
  getDurationHours,
  toDateKey,
  toTimeLabel,
} from '@/features/home/lib/date'

interface PeriodQueryParams {
  startDate: string
  endDate: string
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

async function fetchSchedule(
  endpoint: string,
  params: PeriodQueryParams
): Promise<ScheduleApiResponse> {
  try {
    const response = await axiosInstance.get<ScheduleApiResponse>(endpoint, {
      params,
    })
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

export async function getMonthlySchedules(params: PeriodQueryParams) {
  const response = await fetchSchedule('/app/schedules/self/monthly', params)
  return adaptScheduleResponse(response)
}

export async function getWeeklySchedules(params: PeriodQueryParams) {
  const response = await fetchSchedule('/app/schedules/self/weekly', params)
  return adaptScheduleResponse(response)
}

export async function getDailySchedules(params: PeriodQueryParams) {
  const response = await fetchSchedule('/app/schedules/self/daily', params)
  return adaptScheduleResponse(response)
}
