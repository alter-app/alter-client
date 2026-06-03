import { useQuery } from '@tanstack/react-query'
import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkerListSchedulesQuery(
  workspaceId: number | null,
  year: number,
  month: number
) {
  return useQuery({
    queryKey:
      workspaceId !== null
        ? queryKeys.manager.schedules(workspaceId, year, month)
        : ['manager', 'schedules', null],
    queryFn: () =>
      fetchMonthlySchedules({ workspaceId: workspaceId!, year, month }),
    enabled: workspaceId !== null,
  })
}
