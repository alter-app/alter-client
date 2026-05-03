import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  WorkspaceRequestDetailApiResponse,
  WorkspaceRequestDetailDto,
  WorkspaceRegistrationCreateBody,
  WorkspaceRequestsListApiResponse,
  WorkspaceRequestListItemDto,
} from '@/features/store-register/types/workspaceRequests'

/** GET /app/workspace-requests */
export async function fetchWorkspaceRequests(): Promise<
  WorkspaceRequestListItemDto[]
> {
  const response = await axiosInstance.get<WorkspaceRequestsListApiResponse>(
    '/app/workspace-requests'
  )
  return response.data.data
}

/** GET /app/workspace-requests/{workspaceRequestId} */
export async function fetchWorkspaceRequestDetail(
  workspaceRequestId: number
): Promise<WorkspaceRequestDetailDto> {
  const response = await axiosInstance.get<WorkspaceRequestDetailApiResponse>(
    `/app/workspace-requests/${workspaceRequestId}`
  )
  return response.data.data
}

/** POST /app/workspace-requests */
export async function createWorkspaceRegistrationRequest(
  body: WorkspaceRegistrationCreateBody
): Promise<void> {
  await axiosInstance.post<CommonApiResponse<Record<string, never>>>(
    '/app/workspace-requests',
    body
  )
}
