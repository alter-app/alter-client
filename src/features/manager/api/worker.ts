import axiosInstance from '@/shared/lib/axiosInstance'
import type { UpdateWorkspaceWorkerColorRequest } from '@/features/manager/worker-schedule/types/workerColor'
import type {
  WorkersApiResponse,
  WorkspaceWorkersQueryParams,
} from '@/features/manager/home/types/worker'

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

export async function patchWorkspaceWorkerColor(
  workspaceId: number,
  workerId: number,
  body: UpdateWorkspaceWorkerColorRequest
): Promise<void> {
  await axiosInstance.patch(
    `/manager/workspaces/${workspaceId}/workers/${workerId}/color`,
    body
  )
}
