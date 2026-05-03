import axios from 'axios'
import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  MyInvitationsApiResponse,
  InvitationActionApiResponse,
  MyInvitationsListDto,
  MyInvitationsQueryParams,
  MyJoinRequestsApiResponse,
  MyJoinRequestsListDto,
  MyJoinRequestsQueryParams,
} from '@/features/workspace-join/types/membership'

function buildPagedQuery<
  P extends {
    cursor?: string
    pageSize: number
    from?: string
    to?: string
    status?: string
  }
>(params: P) {
  return {
    pageSize: params.pageSize,
    ...(params.cursor !== undefined && params.cursor !== ''
      ? { cursor: params.cursor }
      : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.from ? { from: params.from } : {}),
    ...(params.to ? { to: params.to } : {}),
  }
}

/** POST /app/workspaces/{workspaceId}/join-requests */
export async function postWorkspaceJoinRequest(
  workspaceId: number
): Promise<void> {
  await axiosInstance.post(`/app/workspaces/${workspaceId}/join-requests`)
}

/** GET /app/users/me/join-requests */
export async function getMyJoinRequests(
  params: MyJoinRequestsQueryParams
): Promise<MyJoinRequestsListDto> {
  const response = await axiosInstance.get<MyJoinRequestsApiResponse>(
    '/app/users/me/join-requests',
    { params: buildPagedQuery(params) }
  )
  return response.data.data
}

/** GET /app/users/me/invitations */
export async function getMyInvitations(
  params: MyInvitationsQueryParams
): Promise<MyInvitationsListDto> {
  const response = await axiosInstance.get<MyInvitationsApiResponse>(
    '/app/users/me/invitations',
    { params: buildPagedQuery(params) }
  )
  return response.data.data
}

/** POST /app/users/me/invitations/{invitationId}/accept */
export async function acceptWorkspaceInvitation(
  invitationId: number
): Promise<void> {
  await axiosInstance.post<InvitationActionApiResponse>(
    `/app/users/me/invitations/${invitationId}/accept`
  )
}

/** POST /app/users/me/invitations/{invitationId}/decline */
export async function declineWorkspaceInvitation(
  invitationId: number
): Promise<void> {
  await axiosInstance.post<InvitationActionApiResponse>(
    `/app/users/me/invitations/${invitationId}/decline`
  )
}

export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message && typeof data.message === 'string')
      return data.message
    if (typeof error.message === 'string' && error.message !== 'Network Error')
      return error.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
