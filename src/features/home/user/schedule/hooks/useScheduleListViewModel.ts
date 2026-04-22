import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSelfSchedule } from '@/features/home/user/schedule/api/schedule'
import { mapToScheduleListItems } from '@/features/home/user/schedule/lib/date'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useScheduleListViewModel() {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date().getMonth() + 1
  )

  const { data: rawData, isPending } = useQuery({
    queryKey: queryKeys.schedules.self({
      year: currentYear,
      month: currentMonth,
    }),
    queryFn: () => getSelfSchedule({ year: currentYear, month: currentMonth }),
  })

  const schedules = useMemo(
    () => mapToScheduleListItems(rawData?.data),
    [rawData]
  )

  const handlePreviousMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentYear(y => y - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }, [currentMonth])

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentYear(y => y + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }, [currentMonth])

  const handleScheduleClick = useCallback((id: string) => {
    console.log('스케줄 클릭:', id)
  }, [])

  return {
    currentYear,
    currentMonth,
    schedules,
    isLoading: isPending,
    handlePreviousMonth,
    handleNextMonth,
    handleScheduleClick,
  }
}
