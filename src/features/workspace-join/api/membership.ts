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

function emptyInvitationsList(pageSize: number): MyInvitationsListDto {
  return {
    page: { cursor: null, pageSize, totalCount: 0 },
    data: [],
  }
}

function normalizeInvitationsList(
  payload: unknown,
  pageSize: number
): MyInvitationsListDto {
  if (payload == null) return emptyInvitationsList(pageSize)
  if (Array.isArray(payload)) {
    return {
      page: { cursor: null, pageSize, totalCount: payload.length },
      data: payload,
    }
  }
  if (typeof payload !== 'object') return emptyInvitationsList(pageSize)

  const list = payload as MyInvitationsListDto
  const rows = Array.isArray(list.data) ? list.data : []

  return {
    page: list.page ?? {
      cursor: null,
      pageSize,
      totalCount: rows.length,
    },
    data: rows,
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
  return normalizeInvitationsList(response.data.data, params.pageSize)
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
