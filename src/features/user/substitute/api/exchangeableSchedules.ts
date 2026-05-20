import axiosInstance from '@/shared/lib/axiosInstance'

import type { ExchangeableSchedulesApiResponse } from '@/features/user/substitute/types'

export interface ExchangeableSchedulesQueryParams {
  year?: number
  month?: number
  day?: number
}

/** GET /app/workspaces/{workspaceId}/exchangeable-schedules */
export async function getExchangeableSchedules(
  workspaceId: number,
  params?: ExchangeableSchedulesQueryParams
): Promise<ExchangeableSchedulesApiResponse> {
  const response = await axiosInstance.get<ExchangeableSchedulesApiResponse>(
    `/app/workspaces/${workspaceId}/exchangeable-schedules`,
    {
      params: {
        ...(params?.year !== undefined && { year: params.year }),
        ...(params?.month !== undefined && { month: params.month }),
        ...(params?.day !== undefined && { day: params.day }),
      },
    }
  )
  return response.data
}
