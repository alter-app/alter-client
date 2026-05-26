import { useMutation, useQueryClient } from '@tanstack/react-query'
import { putScheduleWorker } from '@/features/manager/api/schedule'
import type { RequestPutScheduleWorker } from '@/features/manager/home/types/schedule'

export const PUT_SCHEDULE_WORKER_ERROR_MESSAGES: Record<string, string> = {
  B001: '잘못된 요청입니다.',
  A002: '관리중인 업장이 아닙니다.',
  B020: '요청한 리소스를 찾을 수 없습니다.',
}

export function usePutScheduleWorker(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workShiftId,
      body,
    }: {
      workShiftId: number
      body: RequestPutScheduleWorker
    }) => putScheduleWorker(workShiftId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['manager', 'schedules', workspaceId],
      })
    },
  })
}
