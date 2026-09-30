import axiosInstance from '@/shared/lib/axiosInstance'
import type { WorkspaceListApiResponse } from '@/entities/workspace'
import type { ResignWorkspaceResponse } from '@/features/user/home/workspace/types/resign'
import type { WorkspaceItem } from '@/features/user/home/workspace/types/workspace'

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
