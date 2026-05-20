import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  SendWorkspaceInvitationApiResponse,
  SendWorkspaceInvitationRequest,
} from '@/features/manager/workspace-invite/types/invitation'

/** POST /manager/workspaces/{workspaceId}/invitations */
export async function sendWorkspaceInvitations(
  workspaceId: number,
  body: SendWorkspaceInvitationRequest
): Promise<void> {
  await axiosInstance.post<SendWorkspaceInvitationApiResponse>(
    `/manager/workspaces/${workspaceId}/invitations`,
    body
  )
}
