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

/** "9:0", "09:00:00" 등 → 시·분 두 자리 */
export function splitClockToParts(clock: string): {
  hour: string
  minute: string
} {
  const [hRaw = '0', mRaw = '0'] = clock.trim().split(':')
  const hourNum = Number.parseInt(hRaw, 10)
  const minuteNum = Number.parseInt(mRaw, 10)
  const hour = Number.isFinite(hourNum)
    ? String(hourNum).padStart(2, '0')
    : '00'
  const minute = Number.isFinite(minuteNum)
    ? String(minuteNum).padStart(2, '0')
    : '00'
  return { hour, minute }
}

export function formatClockRangeLabel(startClock: string, endClock: string) {
  const s = splitClockToParts(startClock)
  const e = splitClockToParts(endClock)
  return `${s.hour}:${s.minute} ~ ${e.hour}:${e.minute}`
}

export function formatIsoTimeRangeLabel(startIso: string, endIso: string) {
  return `${toTimeLabel(startIso)} ~ ${toTimeLabel(endIso)}`
}
