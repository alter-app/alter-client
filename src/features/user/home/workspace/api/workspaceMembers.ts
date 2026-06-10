import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  WorkspaceMembersQueryParams,
  WorkspaceManagerItem,
  WorkspaceManagersApiResponse,
  WorkspaceWorkerItem,
  WorkspaceWorkersApiResponse,
  WorkspaceWorkerDto,
  WorkspaceManagerDto,
} from '@/features/user/home/workspace/types/workspaceMembers'

export async function getWorkspaceWorkers(
  workspaceId: number,
  params: WorkspaceMembersQueryParams
): Promise<WorkspaceWorkersApiResponse> {
  const response = await axiosInstance.get<WorkspaceWorkersApiResponse>(
    `/app/users/me/workspaces/${workspaceId}/workers`,
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}

export async function getWorkspaceManagers(
  workspaceId: number,
  params: WorkspaceMembersQueryParams
): Promise<WorkspaceManagersApiResponse> {
  const response = await axiosInstance.get<WorkspaceManagersApiResponse>(
    `/app/users/me/workspaces/${workspaceId}/managers`,
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor !== undefined && { cursor: params.cursor }),
      },
    }
  )
  return response.data
}

export function adaptWorkerDto(dto: WorkspaceWorkerDto): WorkspaceWorkerItem {
  return {
    id: dto.id,
    userId: dto.user.id,
    name: dto.user.name,
    profileImageUrl: dto.user.profileImageUrl ?? null,
    positionType: dto.position.type,
    positionDescription: dto.position.description,
    positionEmoji: dto.position.emoji,
    employedAt: dto.employedAt,
    nextShiftDateTime: dto.nextShiftDateTime,
  }
}

export function adaptManagerDto(
  dto: WorkspaceManagerDto
): WorkspaceManagerItem {
  return {
    id: dto.id,
    managerId: dto.manager.id,
    name: dto.manager.name,
    profileImageUrl: dto.manager.profileImageUrl ?? null,
    positionType: dto.position.type,
    positionDescription: dto.position.description,
    positionEmoji: dto.position.emoji,
  }
}
