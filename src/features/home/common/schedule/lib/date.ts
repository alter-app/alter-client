const ISO_DATE_LENGTH = 10
const ISO_TIME_START = 11
const ISO_TIME_END = 16

export function toDateKey(iso: string | null | undefined) {
  if (iso == null || iso === '') return ''
  return iso.slice(0, ISO_DATE_LENGTH)
}

export function toTimeLabel(iso: string | null | undefined) {
  if (iso == null || iso === '' || iso.length < ISO_TIME_END) {
    return '--:--'
  }
  return iso.slice(ISO_TIME_START, ISO_TIME_END)
}

export function getDurationHours(
  startIso: string | null | undefined,
  endIso: string | null | undefined
) {
  if (startIso == null || endIso == null || startIso === '' || endIso === '') {
    return 0
  }
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  const diffHours = Math.max((end - start) / (1000 * 60 * 60), 0)
  return Number(diffHours.toFixed(1))
}

export { splitClockToParts } from '@/shared/lib/clock'
import { splitClockToParts } from '@/shared/lib/clock'

export function formatClockRangeLabel(
  startClock: string | null | undefined,
  endClock: string | null | undefined
) {
  const s = splitClockToParts(startClock ?? '')
  const e = splitClockToParts(endClock ?? '')
  return `${s.hour}:${s.minute} ~ ${e.hour}:${e.minute}`
}

export function formatIsoTimeRangeLabel(
  startIso: string | null | undefined,
  endIso: string | null | undefined
) {
  return `${toTimeLabel(startIso)} ~ ${toTimeLabel(endIso)}`
}
