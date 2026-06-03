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
    return data.data.flatMap(worker =>
      worker.shifts.map(shift => ({
        id: shift.shiftId,
        name: worker.workerName,
        profileImageUrl: worker.profileImageUrl,
        workTime: formatIsoTimeRangeLabel(
          shift.startDateTime,
          shift.endDateTime
        ),
      }))
    )
  }, [data])

  return {
    todayWorkers,
    isLoading: isPending && workspaceId !== null,
  }
}
