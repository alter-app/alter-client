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

export { splitClockToParts } from '@/shared/lib/clock'
import { splitClockToParts } from '@/shared/lib/clock'

export function formatClockRangeLabel(startClock: string, endClock: string) {
  const s = splitClockToParts(startClock)
  const e = splitClockToParts(endClock)
  return `${s.hour}:${s.minute} ~ ${e.hour}:${e.minute}`
}

export function formatIsoTimeRangeLabel(startIso: string, endIso: string) {
  return `${toTimeLabel(startIso)} ~ ${toTimeLabel(endIso)}`
}
