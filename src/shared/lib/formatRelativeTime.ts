/**
 * 시각을 '방금 전 / N분 전 / N시간 전 / 어제 / N일 전' 형태로 변환합니다.
 *
 * 유사 구현이 2곳 더 있으나 출력 규칙이 달라 통합하지 않았습니다:
 * - features/user/substitute/lib/adaptUserSubstituteRequest.ts — '어제' 없음, NaN → '-'
 * - features/notification/useNotificationViewModel.ts — '방금 전' 없음
 */
export function formatRelativeTime(isoDate: string, now = new Date()): string {
  const target = new Date(isoDate)
  const diffMs = now.getTime() - target.getTime()
  if (Number.isNaN(diffMs)) return ''

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '어제'
  return `${diffDays}일 전`
}
