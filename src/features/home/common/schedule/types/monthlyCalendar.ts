import type { WEEKDAY_LABELS_MONDAY_FIRST } from '@/features/home/common/schedule/constants/calendar'
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
  isWeekend: boolean
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
  weekdayLabels: typeof WEEKDAY_LABELS_MONDAY_FIRST
  monthlyDateCellsState: MonthlyDateCellState[]
}

export interface MonthlyCalendarPropsBase extends BaseCalendarProps {
  selectedDateKey?: string
}
