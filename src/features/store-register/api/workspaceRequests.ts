import axiosInstance from '@/shared/lib/axiosInstance'
import { getAuthApiBasePath } from '@/shared/lib/authApiPath'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  CreateWorkspaceReasonCommentBody,
  WorkspaceReasonCommentDto,
  WorkspaceReasonCommentsApiResponse,
  WorkspaceRequestDetailApiResponse,
  WorkspaceRequestDetailDto,
  WorkspaceRegistrationCreateBody,
  WorkspaceRequestReasonDto,
  WorkspaceRequestReasonsApiResponse,
  WorkspaceRequestsListApiResponse,
  WorkspaceRequestListItemDto,
} from '@/features/store-register/types/workspaceRequests'

type AuthScope = 'MANAGER' | 'USER' | null | undefined

/** `/app/workspace-requests` | `/manager/workspace-requests` */
function requestsBasePath(scope: AuthScope): string {
  return `/${getAuthApiBasePath(scope)}/workspace-requests`
}

/** GET /{scope}/workspace-requests */
export async function fetchWorkspaceRequests(
  scope: AuthScope
): Promise<WorkspaceRequestListItemDto[]> {
  const response = await axiosInstance.get<WorkspaceRequestsListApiResponse>(
    requestsBasePath(scope)
  )
  return response.data.data
}

/** GET /{scope}/workspace-requests/{workspaceRequestId} */
export async function fetchWorkspaceRequestDetail(
  scope: AuthScope,
  workspaceRequestId: number
): Promise<WorkspaceRequestDetailDto> {
  const response = await axiosInstance.get<WorkspaceRequestDetailApiResponse>(
    `${requestsBasePath(scope)}/${workspaceRequestId}`
  )
  return response.data.data
}

/** POST /{scope}/workspace-requests */
export async function createWorkspaceRegistrationRequest(
  scope: AuthScope,
  body: WorkspaceRegistrationCreateBody
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    requestsBasePath(scope),
    body
  )
}

/** POST /{scope}/workspace-requests/{id}/cancel — PENDING/REVOKED 에서만 성공 */
export async function cancelWorkspaceRequest(
  scope: AuthScope,
  workspaceRequestId: number
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/cancel`
  )
}

/** GET /{scope}/workspace-requests/{id}/reasons */
export async function fetchWorkspaceRequestReasons(
  scope: AuthScope,
  workspaceRequestId: number
): Promise<WorkspaceRequestReasonDto[]> {
  const response = await axiosInstance.get<WorkspaceRequestReasonsApiResponse>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/reasons`
  )
  return response.data.data
}

/** GET /{scope}/workspace-requests/{id}/reasons/{reasonId}/comments */
export async function fetchWorkspaceReasonComments(
  scope: AuthScope,
  workspaceRequestId: number,
  reasonId: number
): Promise<WorkspaceReasonCommentDto[]> {
  const response = await axiosInstance.get<WorkspaceReasonCommentsApiResponse>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/reasons/${reasonId}/comments`
  )
  return response.data.data
}

/** POST /{scope}/workspace-requests/{id}/reasons/{reasonId}/comments */
export async function createWorkspaceReasonComment(
  scope: AuthScope,
  workspaceRequestId: number,
  reasonId: number,
  body: CreateWorkspaceReasonCommentBody
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/reasons/${reasonId}/comments`,
    body
  )
}
