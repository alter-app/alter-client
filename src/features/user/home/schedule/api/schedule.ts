import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type { ApiError, ErrorResponse } from '@/shared/types/common'
import type {
  CalendarEvent,
  CalendarViewData,
  MonthlyIncome,
  ScheduleApiResponse,
  ScheduleDataDto,
} from '@/features/user/home/schedule/types/schedule'
import {
  getDurationHours,
  toDateKey,
  toTimeLabel,
} from '@/shared/lib/calendarUtils'
import type { SelfScheduleQueryParams } from '@/shared/types/schedule'

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
  const { estimatedSalary } = response.data
  return {
    summary: {
      totalWorkHours: response.data.totalWorkHours,
      eventCount: response.data.schedules.length,
      ...(typeof estimatedSalary === 'number' && {
        estimatedLaborCost: estimatedSalary,
      }),
    },
    events: response.data.schedules.map(mapToCalendarEvent),
  }
}

/**
 * 월 조회 응답에서 수입 카드 데이터를 만든다.
 * 일 조회·주간 병합 응답은 estimatedSalary가 null이므로 null을 돌려준다.
 */
export function adaptMonthlyIncome(
  response: ScheduleApiResponse
): MonthlyIncome | null {
  const { totalWorkHours, estimatedSalary, workspaceSummaries } = response.data
  if (typeof estimatedSalary !== 'number') return null
  return {
    totalWorkHours,
    estimatedSalary,
    workspaces: (workspaceSummaries ?? []).map(summary => ({
      workspaceId: summary.workspace.workspaceId,
      workspaceName: summary.workspace.workspaceName,
      totalWorkHours: summary.totalWorkHours,
      estimatedSalary: summary.estimatedSalary,
    })),
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
      // 두 달에 걸친 주간 병합 결과는 한 달 기준 수입이 아니다
      estimatedSalary: null,
      workspaceSummaries: null,
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
      // 주간 조회는 월 응답을 빌려 쓰므로 월 기준 수입은 떼어 낸다
      const monthData = await fetchScheduleByMonth(
        params.fromYear,
        params.fromMonth
      )
      return {
        ...monthData,
        data: {
          ...monthData.data,
          estimatedSalary: null,
          workspaceSummaries: null,
        },
      }
    }
    const [fromData, toData] = await Promise.all([
      fetchScheduleByMonth(params.fromYear, params.fromMonth),
      fetchScheduleByMonth(params.toYear, params.toMonth),
    ])
    return mergeScheduleResponses(fromData, toData)
  }
  return fetchScheduleByMonth(params?.year, params?.month, params?.day)
}
