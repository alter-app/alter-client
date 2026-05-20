import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  SubstituteListApiResponse,
  SubstituteRequestsQueryParams,
} from '@/features/manager/home/types/substitute'

export async function approveSubstituteRequest(
  requestId: number,
  body: { approvalComment: string }
): Promise<void> {
  await axiosInstance.post(
    `/manager/substitute-requests/${requestId}/approve`,
    body
  )
}

export async function rejectSubstituteRequest(
  requestId: number,
  body: { approverRejectionReason: string }
): Promise<void> {
  await axiosInstance.post(
    `/manager/substitute-requests/${requestId}/reject`,
    body
  )
}

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
