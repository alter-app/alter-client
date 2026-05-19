export function buildDateFromParts(
  year: string,
  month: string,
  day: string,
  fallback: Date
): Date {
  const parsedYear = Number.parseInt(year, 10)
  const parsedMonth = Number.parseInt(month, 10)
  const parsedDay = Number.parseInt(day, 10)

  const y = Number.isFinite(parsedYear) ? parsedYear : fallback.getFullYear()
  const m = Number.isFinite(parsedMonth)
    ? Math.min(12, Math.max(1, parsedMonth))
    : fallback.getMonth() + 1
  const maxDay = new Date(y, m, 0).getDate()
  const d = Number.isFinite(parsedDay)
    ? Math.min(maxDay, Math.max(1, parsedDay))
    : fallback.getDate()

  return new Date(y, m - 1, d)
}

export function dateToPartStrings(date: Date) {
  return {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

/** Figma 고정 스케줄 날짜 표시 (예: 2026년 4월 1일) */
export function formatKoreanScheduleDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}
