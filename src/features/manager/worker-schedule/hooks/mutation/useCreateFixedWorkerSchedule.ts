import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFixedWorkerSchdules } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import type { RequestPostFixedWorkerSchdules } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useCreateFixedWorkerSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: RequestPostFixedWorkerSchdules) =>
      postFixedWorkerSchdules(workspaceId, body),
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
