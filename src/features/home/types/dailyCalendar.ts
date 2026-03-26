import type { BaseCalendarProps } from '@/features/home/types/calendar'

export type DailyCalendarPropsBase = BaseCalendarProps

export interface DailyTimelineLineViewModel {
  label: string
  top: number
}

export interface DailyEventBlockViewModel {
  key: number
  workspaceName: string
  timeLabel: string
  statusClassName: string
  top: number
  height: number
}

export interface DailyCalendarViewModel {
  title: string
  dateLabel: string
  totalWorkHoursText: string
  timelineHeight: number
  timelineLines: DailyTimelineLineViewModel[]
  eventBlocks: DailyEventBlockViewModel[]
}
