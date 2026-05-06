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
        const isSaturday = cell.weekDay === 0
        const isSunday = cell.weekDay === 1
        const isSelected = cell.dateKey === selectedKey
        const isActiveDay = dayHours > 0 && cell.isCurrentMonth

        return {
          ...cell,
          dayHours,
          dayProgress,
          isSaturday,
          isSunday,
          isSelected,
          isActiveDay,
        }
      }),
    [cells, dayMetricsByDate, selectedKey]
  )
}
