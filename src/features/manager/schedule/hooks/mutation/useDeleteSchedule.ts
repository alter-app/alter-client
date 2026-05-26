import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSchedule } from '@/features/manager/api/schedule'

export function useDeleteSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workShiftId: number) => deleteSchedule(workShiftId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['manager', 'schedules', workspaceId],
      })
    },
  })
}
