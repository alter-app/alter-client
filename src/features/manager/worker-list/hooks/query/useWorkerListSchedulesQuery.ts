import { useQuery } from '@tanstack/react-query'
import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkerListSchedulesQuery(
  workspaceId: number | null,
  year: number,
  month: number
) {
  return useQuery({
    queryKey: queryKeys.manager.schedules(workspaceId ?? 0, year, month),
    queryFn: () =>
      fetchMonthlySchedules({ workspaceId: workspaceId!, year, month }),
    enabled: workspaceId !== null,
  })
}
