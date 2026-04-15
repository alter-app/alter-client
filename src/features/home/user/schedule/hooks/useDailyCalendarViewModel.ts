import { format } from 'date-fns'
import { useMemo } from 'react'
import {
  DAILY_STATUS_STYLE_MAP,
  DAILY_TIMELINE_END_HOUR,
  DAILY_TIMELINE_HEIGHT,
  DAILY_TIMELINE_START_HOUR,
} from '@/features/home/user/schedule/constants/calendar'
import type {
  DailyCalendarPropsBase,
  DailyCalendarViewModel,
} from '@/features/home/user/schedule/types/dailyCalendar'
import type { CalendarEvent } from '@/features/home/user/schedule/types/schedule'

function getStatusStyle(status: string) {
  return DAILY_STATUS_STYLE_MAP[status] ?? 'bg-bg-dark text-text-90'
}

function sortByStartTime(
  a: { startDateTime: string },
  b: { startDateTime: string }
) {
  return a.startDateTime.localeCompare(b.startDateTime)
}

function buildDailyEventBlocks({
  events,
  timelineHeight,
  timelineStartHour,
  totalMinutes,
}: {
  events: CalendarEvent[]
  timelineHeight: number
  timelineStartHour: number
  totalMinutes: number
}) {
  return [...events].sort(sortByStartTime).map(event => {
    const startDate = new Date(event.startDateTime)
    const endDate = new Date(event.endDateTime)

    const startMinutesRaw =
      (startDate.getHours() - timelineStartHour) * 60 + startDate.getMinutes()
    const endMinutesRaw =
      (endDate.getHours() - timelineStartHour) * 60 + endDate.getMinutes()

    const startMinutes = Math.max(0, Math.min(totalMinutes, startMinutesRaw))
    const endMinutes = Math.max(0, Math.min(totalMinutes, endMinutesRaw))
    const durationMinutes = Math.max(endMinutes - startMinutes, 20)

    const top = (startMinutes / totalMinutes) * timelineHeight
    const height = Math.min(
      (durationMinutes / totalMinutes) * timelineHeight,
      timelineHeight - top
    )

    return {
      key: event.shiftId,
      workspaceName: event.workspaceName,
      timeLabel: `${event.startTimeLabel} - ${event.endTimeLabel}`,
      statusClassName: getStatusStyle(event.status),
      top,
      height,
    }
  })
}

export function useDailyCalendarViewModel({
  baseDate,
  data,
  workspaceName,
}: DailyCalendarPropsBase): DailyCalendarViewModel {
  return useMemo(() => {
    const timelineHeight = DAILY_TIMELINE_HEIGHT
    const timelineStartHour = DAILY_TIMELINE_START_HOUR
    const timelineEndHour = DAILY_TIMELINE_END_HOUR
    const totalMinutes = (timelineEndHour - timelineStartHour) * 60

    const timelineLines = Array.from({ length: 7 }, (_, idx) => {
      const label = String(idx + 1).padStart(2, '0')
      const top = ((idx + 1) / 8) * timelineHeight
      return { label, top }
    })

    const eventBlocks = buildDailyEventBlocks({
      events: data?.events ?? [],
      timelineHeight,
      timelineStartHour,
      totalMinutes,
    })

    return {
      title: workspaceName ?? '오늘의 아르바이트',
      dateLabel: format(baseDate, 'yyyy년 M월 d일'),
      totalWorkHoursText: String(data?.summary.totalWorkHours ?? 0).padStart(
        2,
        '0'
      ),
      timelineHeight,
      timelineLines,
      eventBlocks,
    }
  }, [baseDate, data, workspaceName])
}
