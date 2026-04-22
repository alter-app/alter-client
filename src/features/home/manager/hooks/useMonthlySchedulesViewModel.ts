import { useCallback, useMemo, useState } from 'react'
import { addMonths, format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { fetchMonthlySchedules } from '@/features/home/manager/api/schedule'
import { adaptManagerScheduleResponse } from '@/features/home/manager/types/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

export function useMonthlySchedulesViewModel(workspaceId: number | null) {
  const [baseDate, setBaseDate] = useState(() => new Date())

  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1

  const { data: rawData, isPending } = useQuery({
    queryKey: queryKeys.manager.schedules(workspaceId ?? 0, year, month),
    queryFn: () =>
      fetchMonthlySchedules({ workspaceId: workspaceId!, year, month }),
    enabled: workspaceId !== null,
  })

  const calendarData = useMemo(
    () => (rawData ? adaptManagerScheduleResponse(rawData) : null),
    [rawData]
  )

  // 선택된 날짜: 오늘이 현재 월이면 오늘, 아니면 해당 월 1일
  const selectedDateKey = useMemo(() => {
    const today = new Date()
    const todayKey = format(today, DATE_KEY_FORMAT)
    const isSameMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month
    return isSameMonth ? todayKey : format(baseDate, 'yyyy-MM-01')
  }, [baseDate, year, month])

  const onDateChange = useCallback((nextDate: Date) => {
    setBaseDate(nextDate)
  }, [])

  const goToPrevMonth = useCallback(() => {
    setBaseDate(prev => addMonths(prev, -1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setBaseDate(prev => addMonths(prev, 1))
  }, [])

  return {
    baseDate,
    calendarData,
    selectedDateKey,
    isLoading: isPending && workspaceId !== null,
    onDateChange,
    goToPrevMonth,
    goToNextMonth,
  }
}
