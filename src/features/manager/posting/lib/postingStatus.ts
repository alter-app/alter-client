import type { PostingStatus } from '@/features/manager/posting/types/posting'

interface PostingStatusBadgeStyle {
  label: string
  containerClassName: string
  textClassName: string
}

/**
 * 공고 상태 배지 스타일.
 * PDF 기준: 마감임박(warning)은 이번 범위에서 미사용 — API에 마감일 필드 근거 없음.
 */
const POSTING_STATUS_BADGE: Record<PostingStatus, PostingStatusBadgeStyle> = {
  OPEN: {
    label: '모집중',
    containerClassName: 'bg-main-100',
    textClassName: 'text-sub',
  },
  CLOSED: {
    label: '모집완료',
    containerClassName: 'bg-bg-dark',
    textClassName: 'text-text-70',
  },
}

export function resolvePostingStatusBadge(status: PostingStatus) {
  return POSTING_STATUS_BADGE[status]
}

export const POSTING_STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '모집완료' },
] as const

export type PostingStatusFilter =
  (typeof POSTING_STATUS_FILTER_OPTIONS)[number]['value']
