import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ScheduleDataDto } from '@/features/home/user/types/schedule'
import type { HomeCalendarMode } from '@/features/home/user/types/schedule'

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

export function getRangeParamsByMode(baseDate: Date, mode: HomeCalendarMode) {
  if (mode === 'monthly') {
    return {
      startDate: format(startOfMonth(baseDate), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(baseDate), 'yyyy-MM-dd'),
    }
  }

  if (mode === 'weekly') {
    return {
      startDate: format(
        startOfWeek(baseDate, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      ),
      endDate: format(endOfWeek(baseDate, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    }
  }

  const day = format(baseDate, 'yyyy-MM-dd')
  return {
    startDate: day,
    endDate: day,
  }
}

export function moveDateByMode(
  baseDate: Date,
  direction: 'prev' | 'next',
  mode: 'monthly' | 'weekly' | 'daily'
) {
  const unit = direction === 'next' ? 1 : -1
  if (mode === 'monthly') {
    const next = new Date(baseDate)
    next.setMonth(next.getMonth() + unit)
    return next
  }
  if (mode === 'weekly') {
    return addDays(baseDate, 7 * unit)
  }
  return addDays(baseDate, unit)
}
