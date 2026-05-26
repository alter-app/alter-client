import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ManagerScheduleApiResponse,
  ManagerScheduleQueryParams,
  TodayScheduleApiResponse,
  ResponseDeleteScheduleWorker,
  ResponseDeleteSchedule,
} from '@/features/manager/home/types/schedule'

export async function fetchMonthlySchedules(
  params: ManagerScheduleQueryParams
): Promise<ManagerScheduleApiResponse> {
  const response = await axiosInstance.get<ManagerScheduleApiResponse>(
    '/manager/schedules',
    {
      params: {
        workspaceId: params.workspaceId,
        year: params.year,
        month: params.month,
      },
    }
  )
  return response.data
}

export async function fetchTodaySchedules(
  workspaceId: number
): Promise<TodayScheduleApiResponse> {
  const response = await axiosInstance.get<TodayScheduleApiResponse>(
    '/manager/schedules/today',
    { params: { workspaceId } }
  )
  return response.data
}

export async function deleteScheduleWorker(
  workShiftId: number
): Promise<ResponseDeleteScheduleWorker> {
  const response = await axiosInstance.delete<ResponseDeleteScheduleWorker>(
    `/manager/schedules/${workShiftId}/workers`
  )
  return response.data
}

export async function deleteSchedule(
  workShiftId: number
): Promise<ResponseDeleteSchedule> {
  const response = await axiosInstance.delete<ResponseDeleteSchedule>(
    `/manager/schedules/${workShiftId}`
  )
  return response.data
}
