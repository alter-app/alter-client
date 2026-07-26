import type { ApplicationStatus } from '@/features/manager/posting/types/posting'

interface ApplicationStatusBadgeStyle {
  label: string
  containerClassName: string
  textClassName: string
}

/**
 * 지원 상태 배지 (PDF ApplicationStatusBadge).
 * 기존 `shared/ui/home/ApplicationStatusBadge`는 유저 측 4상태 전용이므로
 * 매니저 측 6상태는 여기서 별도로 매핑합니다.
 */
const APPLICATION_STATUS_BADGE: Record<
  ApplicationStatus,
  ApplicationStatusBadgeStyle
> = {
  SUBMITTED: {
    label: '지원완료',
    containerClassName: 'bg-white border border-line-1',
    textClassName: 'text-text-70',
  },
  SHORTLISTED: {
    label: '서류합격',
    containerClassName: 'bg-main-100 border border-main-100',
    textClassName: 'text-sub',
  },
  ACCEPTED: {
    label: '최종합격',
    containerClassName: 'bg-main border border-main',
    textClassName: 'text-white',
  },
  REJECTED: {
    label: '불합격',
    containerClassName: 'bg-white border border-error',
    textClassName: 'text-error',
  },
  CANCELLED: {
    label: '취소',
    containerClassName: 'bg-bg-dark border border-bg-dark',
    textClassName: 'text-text-50',
  },
  EXPIRED: {
    label: '만료',
    containerClassName: 'bg-bg-dark border border-bg-dark',
    textClassName: 'text-text-50',
  },
  DELETED: {
    label: '삭제됨',
    containerClassName: 'bg-bg-dark border border-bg-dark',
    textClassName: 'text-text-50',
  },
}

export function resolveApplicationStatusBadge(status: ApplicationStatus) {
  return APPLICATION_STATUS_BADGE[status]
}

/** 더 이상 상태를 변경할 수 없는(종료된) 지원서 — 채용 결정 액션을 숨깁니다 */
const TERMINAL_STATUSES: ApplicationStatus[] = [
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED',
  'DELETED',
]

export function isTerminalApplicationStatus(status: ApplicationStatus) {
  return TERMINAL_STATUSES.includes(status)
}

/** 채용 결정 액션 — PDF 하단 ActionBar */
export const HIRING_DECISIONS = [
  { status: 'SHORTLISTED', label: '서류합격' },
  { status: 'ACCEPTED', label: '최종합격' },
  { status: 'REJECTED', label: '불합격' },
] as const

export type HiringDecision = (typeof HIRING_DECISIONS)[number]['status']

interface DecisionCopy {
  title: string
  description?: string
  toast: string
}

/** 채용 결정 확인 모달 · 성공 Toast 문구 */
export const DECISION_COPY: Record<HiringDecision, DecisionCopy> = {
  SHORTLISTED: {
    title: '서류합격 처리할까요?',
    description: '지원자에게 서류합격 결과가 전달됩니다.',
    toast: '서류합격 처리됐어요',
  },
  ACCEPTED: {
    title: '최종합격 처리할까요?',
    description: '최종합격 시 해당 지원자가 업장 근무자로 자동 등록됩니다.',
    toast: '최종합격 처리됐어요',
  },
  REJECTED: {
    title: '불합격 처리할까요?',
    description: '불합격 처리 후에는 상태를 변경할 수 없어요.',
    toast: '불합격 처리됐어요',
  },
}

export const APPLICATION_STATUS_FILTER_OPTIONS = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'SUBMITTED', label: '지원완료' },
  { value: 'SHORTLISTED', label: '서류합격' },
  { value: 'ACCEPTED', label: '최종합격' },
  { value: 'REJECTED', label: '불합격' },
  { value: 'CANCELLED', label: '취소' },
  { value: 'EXPIRED', label: '만료' },
] as const

export type ApplicationStatusFilter =
  (typeof APPLICATION_STATUS_FILTER_OPTIONS)[number]['value']
