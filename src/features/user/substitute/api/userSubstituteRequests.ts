import axiosInstance from '@/shared/lib/axiosInstance'

import type {
  ReceivedSubstituteListApiResponse,
  RejectSubstituteRequestBody,
  SentSubstituteDetailApiResponse,
  SentSubstituteListApiResponse,
  SubstituteListQueryParams,
} from '@/features/user/substitute/types'

const DEFAULT_PAGE_SIZE = 20

function listParams(params: SubstituteListQueryParams) {
  return {
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    ...(params.status && { status: params.status }),
    ...(params.cursor != null &&
      params.cursor !== '' && { cursor: params.cursor }),
    ...(params.workspaceId != null && { workspaceId: params.workspaceId }),
  }
}

/** GET /app/users/me/substitute-requests/received */
export async function fetchReceivedSubstituteRequests(
  params: SubstituteListQueryParams = {}
): Promise<ReceivedSubstituteListApiResponse> {
  const response = await axiosInstance.get<ReceivedSubstituteListApiResponse>(
    '/app/users/me/substitute-requests/received',
    { params: listParams(params) }
  )
  return response.data
}

/** GET /app/users/me/substitute-requests/sent */
export async function fetchSentSubstituteRequests(
  params: SubstituteListQueryParams = {}
): Promise<SentSubstituteListApiResponse> {
  const response = await axiosInstance.get<SentSubstituteListApiResponse>(
    '/app/users/me/substitute-requests/sent',
    { params: listParams(params) }
  )
  return response.data
}

/** GET /app/users/me/substitute-requests/sent/{requestId} */
export async function fetchSentSubstituteRequestDetail(
  requestId: number
): Promise<SentSubstituteDetailApiResponse> {
  const response = await axiosInstance.get<SentSubstituteDetailApiResponse>(
    `/app/users/me/substitute-requests/sent/${requestId}`
  )
  return response.data
}

/** POST /app/substitute-requests/{requestId}/accept */
export async function acceptUserSubstituteRequest(
  requestId: number
): Promise<void> {
  await axiosInstance.post(`/app/substitute-requests/${requestId}/accept`)
}

/** POST /app/substitute-requests/{requestId}/reject */
export async function rejectUserSubstituteRequest(
  requestId: number,
  body: RejectSubstituteRequestBody
): Promise<void> {
  await axiosInstance.post(`/app/substitute-requests/${requestId}/reject`, body)
}

/** DELETE /app/users/me/substitute-requests/{requestId} */
export async function cancelUserSubstituteRequest(
  requestId: number
): Promise<void> {
  await axiosInstance.delete(`/app/users/me/substitute-requests/${requestId}`)
}
