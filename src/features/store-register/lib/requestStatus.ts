import type { WorkspaceRequestStatusValue } from '@/features/store-register/types/workspaceRequests'

export interface StatusBadgeStyle {
  label: string
  /** 배지 className (테두리·배경·글자색) */
  badgeClass: string
}

const FALLBACK: StatusBadgeStyle = {
  label: '확인 중',
  badgeClass: 'border-line-1 bg-bg-dark text-text-70',
}

/** 4상태 배지 스타일 (SubstituteApprovalCard 패턴 참고) */
const STATUS_STYLE: Record<WorkspaceRequestStatusValue, StatusBadgeStyle> = {
  PENDING: {
    label: '검토 중',
    badgeClass: 'border-warning bg-warning-100 text-warning',
  },
  ACTIVATED: {
    label: '승인 완료',
    badgeClass: 'border-main bg-main-100 text-main',
  },
  REVOKED: {
    label: '반려',
    badgeClass: 'border-error bg-error/10 text-error',
  },
  CANCELED: {
    label: '취소',
    badgeClass: 'border-line-1 bg-bg-dark text-text-50',
  },
}

/** status.value(서버) → 배지 스타일. description 이 있으면 라벨로 우선 사용 */
export function resolveStatusBadge(status: {
  value: string
  description?: string
}): StatusBadgeStyle {
  const style = STATUS_STYLE[status.value as WorkspaceRequestStatusValue]
  if (!style) {
    return status.description
      ? { ...FALLBACK, label: status.description }
      : FALLBACK
  }
  return style
}
