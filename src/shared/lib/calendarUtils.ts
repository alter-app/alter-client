import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

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
