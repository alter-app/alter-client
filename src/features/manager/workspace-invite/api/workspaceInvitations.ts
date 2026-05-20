import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ManagerInvitationsApiResponse,
  ManagerInvitationsListDto,
  ManagerInvitationsQueryParams,
  SendWorkspaceInvitationApiResponse,
  SendWorkspaceInvitationRequest,
} from '@/features/manager/workspace-invite/types/invitation'

function buildPagedQuery(params: ManagerInvitationsQueryParams) {
  return {
    pageSize: params.pageSize,
    ...(params.cursor ? { cursor: params.cursor } : {}),
    ...(params.status ? { status: params.status } : {}),
  }
}

/** POST /manager/workspaces/{workspaceId}/invitations — 전화번호로 근무자 초대 */
export async function sendWorkspaceInvitation(
  workspaceId: number,
  body: SendWorkspaceInvitationRequest
): Promise<void> {
  await axiosInstance.post<SendWorkspaceInvitationApiResponse>(
    `/manager/workspaces/${workspaceId}/invitations`,
    body
  )
}

/** GET /manager/workspaces/{workspaceId}/invitations — 보낸 초대 목록 */
export async function getWorkspaceInvitations(
  workspaceId: number,
  params: ManagerInvitationsQueryParams
): Promise<ManagerInvitationsListDto> {
  const response = await axiosInstance.get<ManagerInvitationsApiResponse>(
    `/manager/workspaces/${workspaceId}/invitations`,
    { params: buildPagedQuery(params) }
  )
  return response.data.data
}
