export const ManagerSubstituteApiStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED_BY_TARGET: 'REJECTED_BY_TARGET',
  APPROVED: 'APPROVED',
  REJECTED_BY_APPROVER: 'REJECTED_BY_APPROVER',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const

export type ManagerSubstituteApiStatus =
  (typeof ManagerSubstituteApiStatus)[keyof typeof ManagerSubstituteApiStatus]

export const MANAGER_SUBSTITUTE_STATUS_LABEL: Record<
  ManagerSubstituteApiStatus,
  string
> = {
  [ManagerSubstituteApiStatus.PENDING]: '대기중',
  [ManagerSubstituteApiStatus.ACCEPTED]: '요청 수락',
  [ManagerSubstituteApiStatus.REJECTED_BY_TARGET]: '요청 거절',
  [ManagerSubstituteApiStatus.APPROVED]: '승인',
  [ManagerSubstituteApiStatus.REJECTED_BY_APPROVER]: '거절',
  [ManagerSubstituteApiStatus.CANCELLED]: '취소됨',
  [ManagerSubstituteApiStatus.EXPIRED]: '만료됨',
}
