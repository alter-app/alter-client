import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  WorkersApiResponse,
  WorkspaceWorkersQueryParams,
} from '@/features/home/manager/types/worker'

export async function fetchWorkspaceWorkers(
  params: WorkspaceWorkersQueryParams
): Promise<WorkersApiResponse> {
  const { workspaceId, cursor, pageSize, status, name } = params
  const response = await axiosInstance.get<WorkersApiResponse>(
    `/manager/workspaces/${workspaceId}/workers`,
    {
      params: {
        pageSize,
        ...(cursor !== undefined && { cursor }),
        ...(status && { status }),
        ...(name && { name }),
      },
    }
  )
  return response.data
}
