import type { CalendarViewData } from '@/features/home/types/schedule'

export interface BaseCalendarProps {
  baseDate: Date
  data: CalendarViewData | null
  workspaceName?: string
}
