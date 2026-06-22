import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

const ISO_DATE_LENGTH = 10
const ISO_TIME_START = 11
const ISO_TIME_END = 16

export function toDateKey(iso: string | null | undefined): string {
  if (iso == null || iso === '') return ''
  return iso.slice(0, ISO_DATE_LENGTH)
}

export function toTimeLabel(iso: string | null | undefined): string {
  if (iso == null || iso === '' || iso.length < ISO_TIME_END) return '--:--'
  return iso.slice(ISO_TIME_START, ISO_TIME_END)
}

export interface CalendarCell {
  date: Date
  isCurrentMonth: boolean
}

export function getCalendarCells(
  baseDate: Date,
  weekStartsOn: 0 | 1 = 1
): CalendarCell[] {
  const monthStart = startOfMonth(baseDate)
  const monthEnd = endOfMonth(baseDate)
  const intervalStart = startOfWeek(monthStart, { weekStartsOn })
  const intervalEnd = endOfWeek(monthEnd, { weekStartsOn })

  return eachDayOfInterval({ start: intervalStart, end: intervalEnd }).map(
    date => ({
      date,
      isCurrentMonth: isSameMonth(date, baseDate),
    })
  )
}
