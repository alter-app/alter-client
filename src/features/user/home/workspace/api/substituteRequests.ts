import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  CreateSubstituteRequestApiResponse,
  CreateSubstituteRequestBody,
} from '@/features/user/home/workspace/types/substituteRequests'

export interface CreateSubstituteRequestParams {
  scheduleId: number
  body: CreateSubstituteRequestBody
}

/** POST /app/schedules/{scheduleId}/substitute-requests */
export async function createSubstituteRequest({
  scheduleId,
  body,
}: CreateSubstituteRequestParams): Promise<void> {
  await axiosInstance.post<CreateSubstituteRequestApiResponse>(
    `/app/schedules/${scheduleId}/substitute-requests`,
    body
  )
}
