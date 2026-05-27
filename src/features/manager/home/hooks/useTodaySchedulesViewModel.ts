import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTodaySchedules } from '@/features/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'
import { formatIsoTimeRangeLabel } from '@/features/home/common/schedule/lib/date'
import type { TodayWorkerItem } from '@/features/manager/home/ui/TodayWorkerList'

export function useTodaySchedulesViewModel(workspaceId: number | null) {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.manager.todaySchedules(workspaceId ?? 0),
    queryFn: () => fetchTodaySchedules(workspaceId!),
    enabled: workspaceId !== null,
  })

  const todayWorkers = useMemo<TodayWorkerItem[]>(() => {
    if (!data) return []
    const seen = new Set<number>()
    return data.data
      .filter(worker => {
        if (seen.has(worker.workerId)) return false
        seen.add(worker.workerId)
        return true
      })
      .map(worker => ({
        id: worker.workerId,
        name: worker.workerName,
        profileImageUrl: worker.profileImageUrl,
        workTime: worker.shifts[0]
          ? formatIsoTimeRangeLabel(
              worker.shifts[0].startDateTime,
              worker.shifts[0].endDateTime
            )
          : '',
      }))
  }, [data])

  return {
    todayWorkers,
    isLoading: isPending && workspaceId !== null,
  }
}
