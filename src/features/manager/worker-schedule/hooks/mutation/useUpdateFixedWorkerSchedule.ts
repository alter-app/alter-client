import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchFixedWorkerSchdule } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { RequestPatchFixedWorkerSchdules } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

interface UpdateFixedWorkerScheduleParams {
  workerScheduleId: number
  body: RequestPatchFixedWorkerSchdules
}

export function useUpdateFixedWorkerSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workerScheduleId, body }: UpdateFixedWorkerScheduleParams) =>
      patchFixedWorkerSchdule(workspaceId, workerScheduleId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
      })
      void queryClient.invalidateQueries({
        queryKey: ['manager', 'schedules', workspaceId],
      })
    },
  })
}
