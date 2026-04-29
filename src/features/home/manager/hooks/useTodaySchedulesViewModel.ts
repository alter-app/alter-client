import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTodaySchedules } from '@/features/home/manager/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'
import { toTimeLabel } from '@/features/home/common/schedule/lib/date'
import type { TodayWorkerItem } from '@/features/home/manager/ui/TodayWorkerList'

function formatWorkTime(startDateTime: string, endDateTime: string): string {
  return `${toTimeLabel(startDateTime)} ~ ${toTimeLabel(endDateTime)}`
}

export function useTodaySchedulesViewModel(workspaceId: number | null) {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.manager.todaySchedules(workspaceId ?? 0),
    queryFn: () => fetchTodaySchedules(workspaceId!),
    enabled: workspaceId !== null,
  })

  const todayWorkers = useMemo<TodayWorkerItem[]>(() => {
    if (!data) return []
    return data.data.map(worker => ({
      id: worker.workerId,
      name: worker.workerName,
      profileImageUrl: worker.profileImageUrl,
      workTime: worker.shifts[0]
        ? formatWorkTime(worker.shifts[0].startDateTime, worker.shifts[0].endDateTime)
        : '',
    }))
  }, [data])

  return {
    todayWorkers,
    isLoading: isPending && workspaceId !== null,
  }
}
