import { format } from 'date-fns'
import { useMemo } from 'react'
import { getWeeklyDateCells } from '@/features/home/user/schedule/lib/date'
import type {
  WeeklyCalendarPropsBase,
  WeeklyCalendarViewModel,
} from '@/features/home/user/schedule/types/weeklyCalendar'

function getSelectedDayIndex(baseDate: Date) {
  const day = baseDate.getDay()
  return day === 0 ? 6 : day - 1
}

function getDayTotalHours(
  dateKey: string,
  data: WeeklyCalendarPropsBase['data']
) {
  if (!data) return 0
  return Number(
    data.events
      .filter(event => event.dateKey === dateKey)
      .reduce((acc, cur) => acc + cur.durationHours, 0)
      .toFixed(1)
  )
}

export function useWeeklyCalendarViewModel({
  baseDate,
  data,
  workspaceName,
}: WeeklyCalendarPropsBase): WeeklyCalendarViewModel {
  return useMemo(() => {
    const cells = getWeeklyDateCells(baseDate)
    const selectedDayIndex = getSelectedDayIndex(baseDate)
    const maxHours = Math.max(
      ...cells.map(cell => getDayTotalHours(cell.dateKey, data)),
      1
    )

    const dayCells = cells.map((cell, index) => {
      const totalHours = getDayTotalHours(cell.dateKey, data)
      const heightPercent = Math.max((totalHours / maxHours) * 100, 0)
      const primaryHeight = Math.max((heightPercent / 100) * 320, 0)
      const secondaryHeight = Math.max(primaryHeight * 0.78, 0)

      return {
        dateKey: cell.dateKey,
        dayLabel: cell.dayLabel,
        totalHours,
        isSelected: index === selectedDayIndex,
        isPrimaryBar: index % 2 === 1,
        primaryHeight,
        secondaryHeight,
        showSecondary: index !== 0 && totalHours > 0,
      }
    })

    return {
      title: workspaceName ?? `${format(baseDate, 'M월')} 주간 아르바이트`,
      totalWorkHoursText: String(Math.round(data?.summary.totalWorkHours ?? 0)),
      dayCells,
    }
  }, [baseDate, data, workspaceName])
}
