import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'

export async function invalidateManagerScheduleQueries(
  queryClient: QueryClient,
  workspaceId: number,
  year: number,
  month: number
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.manager.schedules(workspaceId, year, month),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.manager.todaySchedules(workspaceId),
    }),
  ])
}
