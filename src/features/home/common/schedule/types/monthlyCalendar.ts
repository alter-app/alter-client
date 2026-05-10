import type { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import type { BaseCalendarProps } from '@/features/home/common/schedule/types/calendarBase'

export interface MonthlyCellInput {
  dateKey: string
  dayText: string
  isCurrentMonth: boolean
  weekDay: number
}

export interface MonthlyDateCellState extends MonthlyCellInput {
  dayHours: number
  dayProgress: number
  isSaturday: boolean
  isSunday: boolean
  isSelected: boolean
  isActiveDay: boolean
}

export interface MonthlyDayMetrics {
  dayHours: number
  dayProgress: number
}

export interface UseMonthlyDateCellsStateParams {
  cells: MonthlyCellInput[]
  dayMetricsByDate: Record<string, MonthlyDayMetrics>
  selectedKey: string
}

export interface MonthlyCalendarViewModel {
  title: string
  monthLabel: string
  totalWorkHoursText: string
  weekdayLabels: typeof WEEKDAY_LABELS
  monthlyDateCellsState: MonthlyDateCellState[]
  estimatedEarningsText?: string
}

export interface MonthlyCalendarPropsBase extends BaseCalendarProps {
  selectedDateKey?: string
  estimatedEarningsText?: string
}
