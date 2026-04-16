import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  SubstituteListApiResponse,
  SubstituteRequestsQueryParams,
} from '@/features/home/manager/types/substitute'

export async function fetchSubstituteRequests(
  params: SubstituteRequestsQueryParams
): Promise<SubstituteListApiResponse> {
  const response = await axiosInstance.get<SubstituteListApiResponse>(
    '/manager/substitute-requests',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.workspaceId !== undefined && {
          workspaceId: params.workspaceId,
        }),
        ...(params.status && { status: params.status }),
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}
