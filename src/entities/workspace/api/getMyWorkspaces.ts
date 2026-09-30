import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  WorkspaceListApiResponse,
  WorkspaceListQueryParams,
} from '../model/workspace'

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
