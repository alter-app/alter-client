import type { BaseCalendarProps } from '@/features/home/user/types/calendar'

export type WeeklyCalendarPropsBase = BaseCalendarProps

export interface WeeklyDayCellViewModel {
  dateKey: string
  dayLabel: string
  totalHours: number
  isSelected: boolean
  isPrimaryBar: boolean
  primaryHeight: number
  secondaryHeight: number
  showSecondary: boolean
}

export interface WeeklyCalendarViewModel {
  title: string
  totalWorkHoursText: string
  dayCells: WeeklyDayCellViewModel[]
}
