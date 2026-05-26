import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteScheduleWorker } from '@/features/manager/api/schedule'

export function useDeleteScheduleWorker(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workShiftId: number) => deleteScheduleWorker(workShiftId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['manager', 'schedules', workspaceId],
      })
    },
  })
}
