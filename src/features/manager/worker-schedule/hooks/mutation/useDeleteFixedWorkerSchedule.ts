import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFixedWorkerSchdule } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useDeleteFixedWorkerSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workerScheduleId: number) =>
      deleteFixedWorkerSchdule(workspaceId, workerScheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
      })
    },
  })
}
