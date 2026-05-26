import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putSchedule } from '@/features/manager/api/schedule'
import type { RequestPutSchedule } from '@/features/manager/home/types/schedule'

export const PUT_SCHEDULE_ERROR_MESSAGES: Record<string, string> = {
  B001: '잘못된 요청입니다.',
  B020: '요청한 리소스를 찾을 수 없습니다.',
}

export function usePutSchedule(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workShiftId,
      body,
    }: {
      workShiftId: number
      body: RequestPutSchedule
    }) => putSchedule(workShiftId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['manager', 'schedules', workspaceId],
      })
    },
  })
}
