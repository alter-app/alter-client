import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  SubstituteListApiResponse,
  SubstituteRequestsQueryParams,
} from '@/features/manager/home/types/substitute'

export async function approveSubstituteRequest(
  requestId: number,
  body: { approvalComment?: string } = {}
): Promise<void> {
  const payload =
    body.approvalComment != null && body.approvalComment.trim() !== ''
      ? { approvalComment: body.approvalComment.trim() }
      : {}
  await axiosInstance.post(
    `/manager/substitute-requests/${requestId}/approve`,
    payload
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
  const status =
    params.status == null
      ? undefined
      : Array.isArray(params.status)
        ? params.status.length > 0
          ? params.status
          : undefined
        : params.status

  const response = await axiosInstance.get<SubstituteListApiResponse>(
    '/manager/substitute-requests',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.workspaceId !== undefined && {
          workspaceId: params.workspaceId,
        }),
        ...(status != null && { status }),
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}
