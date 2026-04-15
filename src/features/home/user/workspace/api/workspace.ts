import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  WorkspaceItem,
  WorkspaceListApiResponse,
  WorkspaceListQueryParams,
} from '@/features/home/user/workspace/types/workspace'

function mapToWorkspaceItem(dto: WorkspaceListApiResponse['data']['data'][number]): WorkspaceItem {
  return {
    workspaceId: dto.workspaceId,
    businessName: dto.businessName,
    employedAt: dto.employedAt,
    nextShiftDateTime: dto.nextShiftDateTime,
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

export function adaptWorkspaceListResponse(
  response: WorkspaceListApiResponse
): WorkspaceItem[] {
  return response.data.data.map(mapToWorkspaceItem)
}
