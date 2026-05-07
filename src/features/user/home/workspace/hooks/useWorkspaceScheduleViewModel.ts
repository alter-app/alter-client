import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { HomeCalendarMode } from '@/features/user/home/schedule/types/schedule'
import { getScheduleParamsByMode } from '@/features/user/home/schedule/lib/date'
import { queryKeys } from '@/shared/lib/queryKeys'
import {
  getWorkspaceSchedule,
  adaptWorkspaceScheduleToCalendar,
  deriveWorkerList,
} from '@/features/user/home/workspace/api/workspaceSchedule'

export function useWorkspaceScheduleViewModel(workspaceId: number) {
  const [mode, setMode] = useState<HomeCalendarMode>('monthly')
  const [baseDate, setBaseDate] = useState(() => new Date())

  const params = getScheduleParamsByMode(baseDate, mode)

  const {
    data: rawData,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.workspace.schedules(workspaceId, params),
    queryFn: () => getWorkspaceSchedule(workspaceId, params),
    enabled: workspaceId > 0,
  })

  const calendarData = useMemo(
    () => (rawData ? adaptWorkspaceScheduleToCalendar(rawData) : null),
    [rawData]
  )

  const workers = useMemo(
    () => (rawData ? deriveWorkerList(rawData) : []),
    [rawData]
  )

  const onDateChange = useCallback((nextDate: Date) => {
    setBaseDate(nextDate)
  }, [])

  return {
    mode,
    setMode,
    baseDate,
    calendarData,
    workers,
    isLoading: isPending,
    isError,
    onDateChange,
  }
}
