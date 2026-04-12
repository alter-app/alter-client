import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { HomeCalendarMode } from '@/features/home/user/types/schedule'
import {
  getSelfSchedule,
  adaptScheduleResponse,
} from '@/features/home/user/api/schedule'
import { getScheduleParamsByMode } from '@/features/home/user/lib/date'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useHomeScheduleViewModel() {
  const [mode, setMode] = useState<HomeCalendarMode>('monthly')
  const [baseDate, setBaseDate] = useState(() => new Date())

  const params = getScheduleParamsByMode(baseDate, mode)

  const { data: rawData, isPending, error } = useQuery({
    queryKey: queryKeys.schedules.self(params),
    queryFn: () => getSelfSchedule(params),
  })

  const calendarData = useMemo(
    () => (rawData ? adaptScheduleResponse(rawData) : null),
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
    isLoading: isPending,
    error,
    onDateChange,
  }
}
