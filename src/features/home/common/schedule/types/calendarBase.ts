import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'

export interface BaseCalendarProps {
  baseDate: Date
  data: CalendarViewData | null
  workspaceName?: string
}
