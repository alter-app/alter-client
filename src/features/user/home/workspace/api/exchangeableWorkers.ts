import axiosInstance from '@/shared/lib/axiosInstance'
import type { ExchangeableWorkersApiResponse } from '@/features/user/home/workspace/types/exchangeableWorkers'

export interface GetExchangeableWorkersParams {
  scheduleId: number
  pageSize: number
  cursor?: string
}

/** GET /app/schedules/{scheduleId}/exchangeable-workers */
export async function getExchangeableWorkers(
  params: GetExchangeableWorkersParams
): Promise<ExchangeableWorkersApiResponse> {
  const response = await axiosInstance.get<ExchangeableWorkersApiResponse>(
    `/app/schedules/${params.scheduleId}/exchangeable-workers`,
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor != null &&
          params.cursor !== '' && {
            cursor: params.cursor,
          }),
      },
    }
  )
  return response.data
}
