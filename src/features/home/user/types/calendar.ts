import type { CalendarViewData } from '@/features/home/user/types/schedule'

export interface BaseCalendarProps {
  baseDate: Date
  data: CalendarViewData | null
  workspaceName?: string
}
