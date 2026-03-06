import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ApiError,
  CommonApiResponse,
  ErrorResponse,
} from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'

type SelfScheduleResponse = CommonApiResponse<{
  totalWorkHours: number
  schedules: {
    shiftId: number
    workspace: {
      workspaceId: number
      workspaceName: string
    }
    startDateTime: string
    endDateTime: string
    position: string
    status: StatusEnum
  }[]
}>

type GetSelfScheduleParams = {
  year?: number
  month?: number
  day?: number
}

/**
 * 나의 근무 스케줄 조회
 * 파라미터 조합에 따라 조회가 달라집니다.
- 인자 없음: 이번 주 스케줄 조회
- year, month: 해당 월 스케줄 조회
- year, month, day: 해당 일 스케줄 조회
 *
 * @param params.year 조회할 연도
 * @param params.month 조회할 월
 * @param params.day 조회할 일 (일별 조회 시 사용)
 * @returns
 */
export async function getSelfSchedule(
  params?: GetSelfScheduleParams
): Promise<SelfScheduleResponse> {
  const { year, month, day } = params ?? {}

  try {
    const response = await axiosInstance.get<SelfScheduleResponse>(
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
      const message =
        errorData.message ?? '나의 근무 스케줄 조회 중 오류가 발생했습니다.'
      const apiError = new Error(message) as ApiError & Error
      throw apiError
    }
    throw new Error('나의 근무 스케줄 조회 중 오류가 발생했습니다.')
  }
}
