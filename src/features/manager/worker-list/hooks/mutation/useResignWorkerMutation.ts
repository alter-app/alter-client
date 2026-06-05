import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resignWorker } from '@/features/manager/api/worker'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { ResignWorkerParams } from '@/features/manager/worker-list/types/resign'

export function useResignWorkerMutation(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workerId: ResignWorkerParams['workerId']) =>
      resignWorker({ workspaceId, workerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.managerWorkspace.workers(workspaceId),
      })
    },
  })
}
