import { useQuery } from '@tanstack/react-query'
import { fetchWorkspaceWorkers } from '@/features/manager/api/worker'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { WorkersApiResponse } from '@/features/manager/home/types/worker'

const PAGE_SIZE = 50

interface UseWorkspaceWorkersParams {
  workspaceId?: number
  status?: string
  name?: string
}

export function useWorkspaceWorkers({
  workspaceId,
  status,
  name,
}: UseWorkspaceWorkersParams) {
  return useQuery<WorkersApiResponse>({
    queryKey: queryKeys.managerWorkspace.workers(workspaceId ?? 0, {
      status,
      name,
      pageSize: PAGE_SIZE,
    }),
    queryFn: () =>
      fetchWorkspaceWorkers({
        workspaceId: workspaceId ?? 0,
        pageSize: PAGE_SIZE,
        status,
        name,
      }),
    enabled: !!workspaceId,
  })
}
