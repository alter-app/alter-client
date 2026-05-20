import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  InvitationActionApiResponse,
  MyInvitationsApiResponse,
  MyInvitationsListDto,
  MyInvitationsQueryParams,
} from '@/features/workspace-join/types/membership'

function buildPagedQuery(params: MyInvitationsQueryParams) {
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
