import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ManagedWorkspacesApiResponse,
  WorkspaceDetailApiResponse,
} from '@/features/home/manager/types/workspace'

export async function fetchManagedWorkspaces(): Promise<ManagedWorkspacesApiResponse> {
  const response = await axiosInstance.get<ManagedWorkspacesApiResponse>(
    '/manager/workspaces'
  )
  return response.data
}

export async function fetchWorkspaceDetail(
  workspaceId: number
): Promise<WorkspaceDetailApiResponse> {
  const response = await axiosInstance.get<WorkspaceDetailApiResponse>(
    `/manager/workspaces/${workspaceId}`
  )
  return response.data
}
