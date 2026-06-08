import axiosInstance from '@/shared/lib/axiosInstance'
import type { ResignWorkspaceResponse } from '@/features/user/home/workspace/types/resign'
import type {
  WorkspaceItem,
  WorkspaceListApiResponse,
  WorkspaceListQueryParams,
} from '@/features/user/home/workspace/types/workspace'

function mapToWorkspaceItem(
  dto: WorkspaceListApiResponse['data']['data'][number]
): WorkspaceItem {
  return {
    workspaceId: dto.workspaceId,
    businessName: dto.businessName,
    employedAt: dto.employedAt,
    nextShiftDateTime: dto.nextShiftDateTime ?? null,
  }
}

export async function getMyWorkspaces(
  params: WorkspaceListQueryParams
): Promise<WorkspaceListApiResponse> {
  const response = await axiosInstance.get<WorkspaceListApiResponse>(
    '/app/users/me/workspaces',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}

export async function resignWorkspace(
  workspaceId: number
): Promise<ResignWorkspaceResponse> {
  const response = await axiosInstance.patch<ResignWorkspaceResponse>(
    `/app/users/me/workspaces/${workspaceId}/resign`
  )
  return response.data
}

export function adaptWorkspaceListResponse(
  response: WorkspaceListApiResponse
): WorkspaceItem[] {
  return response.data.data.map(mapToWorkspaceItem)
}
