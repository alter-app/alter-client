import { format } from 'date-fns'
import { splitClockToParts } from '@/shared/lib/clock'
import { snapMinuteToTen } from '@/shared/lib/snapMinuteToTen'

/** UI 시·분 → API LocalTime (`HH:mm:ss`) */
export function toApiLocalTime(hour: string, minute: string): string {
  const { hour: h, minute: m } = splitClockToParts(
    `${hour || '0'}:${snapMinuteToTen(minute)}`
  )
  return `${h}:${m}:00`
}

/** API LocalTime → UI 시·분 (두 자리) */
export function fromApiLocalTime(time: string): {
  hour: string
  minute: string
} {
  return splitClockToParts(time)
}

/** 날짜 + 시·분 → API LocalDateTime (`yyyy-MM-dd'T'HH:mm:ss`) */
export function toApiLocalDateTime(
  date: Date,
  hour: string,
  minute: string
): string {
  const { hour: h, minute: m } = splitClockToParts(
    `${hour || '0'}:${snapMinuteToTen(minute)}`
  )
  const datePart = format(date, 'yyyy-MM-dd')
  return `${datePart}T${h}:${m}:00`
}

export function dateTimeToHourMinute(iso: string): {
  hour: string
  minute: string
} {
  const timePart = iso.includes('T') ? (iso.split('T')[1] ?? '') : iso
  return splitClockToParts(timePart)
}
