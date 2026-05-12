import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postFixedWorkerSchdules } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { RequestPostFixedWorkerSchdules } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

export function useCreateFixedWorkerSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: RequestPostFixedWorkerSchdules) =>
      postFixedWorkerSchdules(workspaceId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
      })
    },
  })
}
