import type { StatusEnum } from '@/shared/types/enums'

export interface CalendarEvent {
  shiftId: number
  workspaceName: string
  position: string
  status: StatusEnum
  startDateTime: string
  endDateTime: string
  dateKey: string
  startTimeLabel: string
  endTimeLabel: string
  durationHours: number
}

export interface CalendarSummary {
  totalWorkHours: number
  eventCount: number
  estimatedLaborCost?: number
}

export interface CalendarViewData {
  summary: CalendarSummary
  events: CalendarEvent[]
}
