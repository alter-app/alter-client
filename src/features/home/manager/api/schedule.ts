import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ManagerScheduleApiResponse,
  ManagerScheduleQueryParams,
} from '@/features/home/manager/types/schedule'

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
