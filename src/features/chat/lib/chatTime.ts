/** 채팅 전용 시간 표기 — 말풍선 옆 시각, 날짜 구분선, 목록 상대 시각 */

const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

function toValidDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** 말풍선 옆 시각 — '오전 11:02' */
export function formatMessageTime(value: string | Date): string {
  const date = toValidDate(value)
  if (!date) return ''

  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const meridiem = hours < 12 ? '오전' : '오후'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12

  return `${meridiem} ${displayHours}:${minutes}`
}

/** 날짜 구분선 — '2026년 8월 19일 (수)', 올해면 '8월 19일 (수)' */
export function formatDateDivider(
  value: string | Date,
  now: Date = new Date()
): string {
  const date = toValidDate(value)
  if (!date) return ''

  const monthDay = `${date.getMonth() + 1}월 ${date.getDate()}일 (${KOREAN_WEEKDAYS[date.getDay()]})`

  return date.getFullYear() === now.getFullYear()
    ? monthDay
    : `${date.getFullYear()}년 ${monthDay}`
}

/** 같은 날짜인지 — 날짜 구분선 삽입 판단용 */
export function isSameDay(a: string | Date, b: string | Date): boolean {
  const dateA = toValidDate(a)
  const dateB = toValidDate(b)
  if (!dateA || !dateB) return false
  return startOfDay(dateA) === startOfDay(dateB)
}

/**
 * 채팅 목록 행의 상대 시각.
 * 오늘은 시각, 어제는 '어제', 올해는 'M월 D일', 그 이전은 'YYYY. M. D.'
 */
export function formatChatListTime(
  value: string | Date,
  now: Date = new Date()
): string {
  const date = toValidDate(value)
  if (!date) return ''

  const dayDiff = Math.round(
    (startOfDay(now) - startOfDay(date)) / (24 * 60 * 60 * 1000)
  )

  if (dayDiff <= 0) return formatMessageTime(date)
  if (dayDiff === 1) return '어제'
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`
}
