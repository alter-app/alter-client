import { addDays, format, startOfDay } from 'date-fns'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import { useMemo } from 'react'
import {
  DATE_KEY_FORMAT,
  MONTH_LABEL_FORMAT,
} from '@/features/home/common/schedule/constants/calendar'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import { useMonthlyDateCellsState } from '@/features/home/common/schedule/hooks/useMonthlyDateCellsState'
import type {
  MonthlyCalendarViewModel,
  MonthlyDayMetrics,
  MonthlyCalendarPropsBase,
} from '@/features/home/common/schedule/types/monthlyCalendar'
import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'

type MinuteRange = [number, number]

function mergeMinuteRanges(ranges: MinuteRange[]) {
  if (ranges.length === 0) return 0
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])
  let [currentStart, currentEnd] = sorted[0]
  let total = 0

  for (let idx = 1; idx < sorted.length; idx += 1) {
    const [nextStart, nextEnd] = sorted[idx]
    if (nextStart <= currentEnd) {
      currentEnd = Math.max(currentEnd, nextEnd)
      continue
    }
    total += currentEnd - currentStart
    currentStart = nextStart
    currentEnd = nextEnd
  }

  total += currentEnd - currentStart
  return total
}

function getDayMetricsByDate(data: CalendarViewData | null) {
  const rangesByDate: Record<string, MinuteRange[]> = {}

  ;(data?.events ?? []).forEach(event => {
    const start = new Date(event.startDateTime)
    const end = new Date(event.endDateTime)

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return
    }

    let cursor = startOfDay(start)
    const lastDay = startOfDay(end)

    while (cursor <= lastDay) {
      const nextDay = addDays(cursor, 1)
      const clipStart = Math.max(start.getTime(), cursor.getTime())
      const clipEnd = Math.min(end.getTime(), nextDay.getTime())

      if (clipEnd > clipStart) {
        const dayKey = format(cursor, DATE_KEY_FORMAT)
        const startMinute = (clipStart - cursor.getTime()) / (1000 * 60)
        const endMinute = (clipEnd - cursor.getTime()) / (1000 * 60)
        rangesByDate[dayKey] = rangesByDate[dayKey] ?? []
        rangesByDate[dayKey].push([startMinute, endMinute])
      }

      cursor = nextDay
    }
  })

  return Object.entries(rangesByDate).reduce<Record<string, MonthlyDayMetrics>>(
    (acc, [dateKey, ranges]) => {
      const occupiedMinutes = mergeMinuteRanges(ranges)
      const dayHours = Number((occupiedMinutes / 60).toFixed(1))
      const dayProgress = Math.min(Math.max(occupiedMinutes / (24 * 60), 0), 1)
      acc[dateKey] = { dayHours, dayProgress }
      return acc
    },
    {}
  )
}

export function useMonthlyCalendarViewModel({
  baseDate,
  data,
  workspaceName,
  selectedDateKey,
}: MonthlyCalendarPropsBase): MonthlyCalendarViewModel {
  const cells = useMemo(
    () =>
      getCalendarCells(baseDate, 0).map(({ date, isCurrentMonth }) => ({
        dateKey: format(date, DATE_KEY_FORMAT),
        dayText: format(date, 'd'),
        isCurrentMonth,
        weekDay: date.getDay(),
      })),
    [baseDate]
  )
  const selectedKey = selectedDateKey ?? format(baseDate, DATE_KEY_FORMAT)

  const dayMetricsByDate = useMemo(() => getDayMetricsByDate(data), [data])

  const monthlyDateCellsState = useMonthlyDateCellsState({
    cells,
    dayMetricsByDate,
    selectedKey,
  })

  const estimatedLaborCost = data?.summary.estimatedLaborCost

  const estimatedEarningsText = useMemo(() => {
    if (estimatedLaborCost == null) return undefined
    return `약 ${estimatedLaborCost.toLocaleString()}원`
  }, [estimatedLaborCost])

  return {
    title: workspaceName ?? '월간 아르바이트',
    monthLabel: format(baseDate, MONTH_LABEL_FORMAT),
    totalWorkHoursText: String(
      Math.round(data?.summary.totalWorkHours ?? 0)
    ).padStart(2, '0'),
    weekdayLabels: WEEKDAY_LABELS,
    monthlyDateCellsState,
    estimatedEarningsText,
  }
}
