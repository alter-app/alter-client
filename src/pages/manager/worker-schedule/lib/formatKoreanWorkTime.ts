export function formatKoreanTimePart(hour: string, minute: string): string {
  const hourNum = Number.parseInt(hour || '0', 10)
  const minutePart = snapMinuteToTen(minute)
  const period = hourNum < 12 ? '오전' : '오후'
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12
  return `${period} ${hour12}시 ${minutePart}분`
}

export type TimePeriod = '오전' | '오후'

export function hour24To12Parts(hour24: string): {
  period: TimePeriod
  hour12: number
} {
  const hourNum = Number.parseInt(hour24 || '0', 10)
  const safeHour = Number.isFinite(hourNum) ? hourNum : 0
  return {
    period: safeHour < 12 ? '오전' : '오후',
    hour12: safeHour % 12 === 0 ? 12 : safeHour % 12,
  }
}

export const WORK_TIME_MINUTE_STEP = 10

export const WORK_TIME_MINUTE_OPTIONS = [
  '00',
  '10',
  '20',
  '30',
  '40',
  '50',
] as const

/** 10분 단위로 반올림 (00~50) */
export function snapMinuteToTen(minute: string): string {
  const n = Number.parseInt(minute || '0', 10)
  const safe = Number.isFinite(n) ? n : 0
  const snapped = Math.min(
    50,
    Math.round(safe / WORK_TIME_MINUTE_STEP) * WORK_TIME_MINUTE_STEP
  )
  return String(snapped).padStart(2, '0')
}

export function minuteToTenMinuteIndex(minute: string): number {
  const snapped = snapMinuteToTen(minute)
  const idx = WORK_TIME_MINUTE_OPTIONS.indexOf(
    snapped as (typeof WORK_TIME_MINUTE_OPTIONS)[number]
  )
  return idx >= 0 ? idx : 0
}

export function partsToHour24(period: TimePeriod, hour12: number): string {
  let hour24 = hour12 % 12
  if (period === '오후') hour24 += 12
  if (period === '오전' && hour12 === 12) hour24 = 0
  if (period === '오후' && hour12 === 12) hour24 = 12
  return String(hour24).padStart(2, '0')
}
