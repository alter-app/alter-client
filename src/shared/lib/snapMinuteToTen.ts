const WORK_TIME_MINUTE_STEP = 10

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
