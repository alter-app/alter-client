import { useQuery } from '@tanstack/react-query'
import { getFixedWorkerSchdules } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useFixedWorkerSchedules(workspaceId: number) {
  return useQuery({
    queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
    queryFn: () => getFixedWorkerSchdules(workspaceId),
    enabled: !!workspaceId,
  })
}
