import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ScheduleDataDto } from '@/features/home/user/schedule/types/schedule'
import type { HomeCalendarMode } from '@/features/home/user/schedule/types/schedule'
import type { SelfScheduleQueryParams } from '@/features/home/user/schedule/api/schedule'
import type { ScheduleListItem } from '@/features/home/user/schedule/types/scheduleList'
import { WEEKDAY_LABELS } from '@/features/home/user/schedule/constants/calendar'

const ISO_DATE_LENGTH = 10
const ISO_TIME_START = 11
const ISO_TIME_END = 16

export function toDateKey(iso: string) {
  return iso.slice(0, ISO_DATE_LENGTH)
}

export function toTimeLabel(iso: string) {
  return iso.slice(ISO_TIME_START, ISO_TIME_END)
}

export function getDurationHours(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  const diffHours = Math.max((end - start) / (1000 * 60 * 60), 0)
  return Number(diffHours.toFixed(1))
}

export function getMonthlyDateCells(baseDate: Date) {
  const monthStart = startOfMonth(baseDate)
  const monthEnd = endOfMonth(baseDate)
  const intervalStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const intervalEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  return eachDayOfInterval({ start: intervalStart, end: intervalEnd }).map(
    date => ({
      date,
      dateKey: format(date, 'yyyy-MM-dd'),
      day: format(date, 'd'),
      isCurrentMonth: isSameMonth(date, baseDate),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    })
  )
}

export function getWeeklyDateCells(baseDate: Date) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 })

  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(date => ({
    date,
    dateKey: format(date, 'yyyy-MM-dd'),
    dayLabel: format(date, 'EEE', { locale: ko }),
    day: format(date, 'd'),
    isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
  }))
}

export function getDayHours(
  events: ScheduleDataDto['schedules'],
  dateKey: string
) {
  return events
    .filter(item => toDateKey(item.startDateTime) === dateKey)
    .reduce(
      (acc, cur) => acc + getDurationHours(cur.startDateTime, cur.endDateTime),
      0
    )
}

export function getWeekRangeLabel(baseDate: Date) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 })
  return `${format(weekStart, 'M/d')} - ${format(weekEnd, 'M/d')}`
}

export function getDailyHourTicks() {
  return Array.from(
    { length: 24 },
    (_, idx) => `${idx.toString().padStart(2, '0')}:00`
  )
}

export function getScheduleParamsByMode(
  baseDate: Date,
  mode: HomeCalendarMode
): SelfScheduleQueryParams {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1
  if (mode === 'daily') {
    return { year, month, day: baseDate.getDate() }
  }
  return { year, month }
}

export function formatScheduleTimeRange(
  startIso: string,
  endIso: string
): { time: string; hours: string } {
  const durationHours = getDurationHours(startIso, endIso)
  const hoursLabel = Number.isInteger(durationHours)
    ? `${durationHours}시간`
    : `${durationHours.toFixed(1)}시간`
  return {
    time: `${toTimeLabel(startIso)} ~ ${toTimeLabel(endIso)}`,
    hours: hoursLabel,
  }
}

export function mapToScheduleListItems(
  data: ScheduleDataDto | undefined
): ScheduleListItem[] {
  if (!data) return []
  return data.schedules.map(schedule => {
    const start = new Date(schedule.startDateTime)
    const { time, hours } = formatScheduleTimeRange(
      schedule.startDateTime,
      schedule.endDateTime
    )
    return {
      id: String(schedule.shiftId),
      day: WEEKDAY_LABELS[start.getDay()],
      date: String(start.getDate()),
      workplace: schedule.workspace.workspaceName,
      time,
      hours,
    }
  })
}

export function moveDateByMode(
  baseDate: Date,
  direction: 'prev' | 'next',
  mode: 'monthly' | 'weekly' | 'daily'
) {
  const unit = direction === 'next' ? 1 : -1
  if (mode === 'monthly') {
    return addMonths(baseDate, unit)
  }
  if (mode === 'weekly') {
    return addDays(baseDate, 7 * unit)
  }
  return addDays(baseDate, unit)
}
