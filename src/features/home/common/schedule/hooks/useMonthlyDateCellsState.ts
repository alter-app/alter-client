import { useMemo } from 'react'
import type { UseMonthlyDateCellsStateParams } from '@/features/home/common/schedule/types/monthlyCalendar'

export function useMonthlyDateCellsState({
  cells,
  dayMetricsByDate,
  selectedKey,
}: UseMonthlyDateCellsStateParams) {
  return useMemo(
    () =>
      cells.map(cell => {
        const dayMetrics = dayMetricsByDate[cell.dateKey]
        const dayHours = dayMetrics?.dayHours ?? 0
        const dayProgress = dayMetrics?.dayProgress ?? 0
        const isWeekend = cell.weekDay === 0 || cell.weekDay === 6
        const isSelected = cell.dateKey === selectedKey
        const isActiveDay = dayHours > 0 && cell.isCurrentMonth

        return {
          ...cell,
          dayHours,
          dayProgress,
          isWeekend,
          isSelected,
          isActiveDay,
        }
      }),
    [cells, dayMetricsByDate, selectedKey]
  )
}
