import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSchedule } from '@/features/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useDeleteSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workShiftId: number) => deleteSchedule(workShiftId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.manager.schedulesByWorkspace(workspaceId),
      })
    },
  })
}
