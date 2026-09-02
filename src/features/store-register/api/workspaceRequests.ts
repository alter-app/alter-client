import axiosInstance from '@/shared/lib/axiosInstance'
import { getAuthApiBasePath } from '@/shared/lib/authApiPath'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  BusinessTypeDto,
  BusinessTypesApiResponse,
  CreateWorkspaceRequestCommentBody,
  WorkspaceRequestCommentDto,
  WorkspaceRequestCommentsApiResponse,
  WorkspaceRequestDetailApiResponse,
  WorkspaceRequestDetailDto,
  WorkspaceRegistrationCreateBody,
  WorkspaceRequestsListApiResponse,
  WorkspaceRequestListItemDto,
} from '@/features/store-register/types/workspaceRequests'

type AuthScope = 'MANAGER' | 'USER' | null | undefined

/** `/app/workspace-requests` | `/manager/workspace-requests` */
function requestsBasePath(scope: AuthScope): string {
  return `/${getAuthApiBasePath(scope)}/workspace-requests`
}

/** GET /{scope}/workspace-requests/business-types — 등록 신청 폼용 업종 목록 */
export async function fetchBusinessTypes(
  scope: AuthScope
): Promise<BusinessTypeDto[]> {
  const response = await axiosInstance.get<BusinessTypesApiResponse>(
    `${requestsBasePath(scope)}/business-types`
  )
  return response.data.data
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

/** GET /{scope}/workspace-requests/{id}/comments */
export async function fetchWorkspaceRequestComments(
  scope: AuthScope,
  workspaceRequestId: number
): Promise<WorkspaceRequestCommentDto[]> {
  const response = await axiosInstance.get<WorkspaceRequestCommentsApiResponse>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/comments`
  )
  return response.data.data
}

/** POST /{scope}/workspace-requests/{id}/comments */
export async function createWorkspaceRequestComment(
  scope: AuthScope,
  workspaceRequestId: number,
  body: CreateWorkspaceRequestCommentBody
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    `${requestsBasePath(scope)}/${workspaceRequestId}/comments`,
    body
  )
}
