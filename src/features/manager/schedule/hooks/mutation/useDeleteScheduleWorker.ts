import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteScheduleWorker } from '@/features/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useDeleteScheduleWorker(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workShiftId: number) => deleteScheduleWorker(workShiftId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.manager.schedulesByWorkspace(workspaceId),
      })
    },
  })
}
