import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'

export function invalidateManagerScheduleQueries(
  queryClient: QueryClient,
  workspaceId: number,
  year: number,
  month: number
) {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.manager.schedules(workspaceId, year, month),
  })
  void queryClient.invalidateQueries({
    queryKey: queryKeys.manager.todaySchedules(workspaceId),
  })
}
