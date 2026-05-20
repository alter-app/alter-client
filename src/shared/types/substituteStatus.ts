export const SubstituteApiStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED_BY_TARGET: 'REJECTED_BY_TARGET',
  APPROVED: 'APPROVED',
  REJECTED_BY_APPROVER: 'REJECTED_BY_APPROVER',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const

export type SubstituteApiStatus =
  (typeof SubstituteApiStatus)[keyof typeof SubstituteApiStatus]

export const SUBSTITUTE_STATUS_LABEL: Record<SubstituteApiStatus, string> = {
  [SubstituteApiStatus.PENDING]: '대기중',
  [SubstituteApiStatus.ACCEPTED]: '요청 수락',
  [SubstituteApiStatus.REJECTED_BY_TARGET]: '요청 거절',
  [SubstituteApiStatus.APPROVED]: '승인',
  [SubstituteApiStatus.REJECTED_BY_APPROVER]: '거절',
  [SubstituteApiStatus.CANCELLED]: '취소됨',
  [SubstituteApiStatus.EXPIRED]: '만료됨',
}
