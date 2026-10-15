import { SubstituteApiStatus } from '@/shared/types/substituteStatus'

export type ManagerSubstituteListStatusFilter =
  | 'all'
  | 'pending'
  | 'accepted'
  | 'cancelled'

export type ManagerSubstituteListFilters = {
  statusFilter: ManagerSubstituteListStatusFilter
}

export const MANAGER_SUBSTITUTE_STATUS_FILTER_OPTIONS: {
  key: ManagerSubstituteListStatusFilter
  label: string
}[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '요청됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

export function managerStatusFilterLabel(
  filter: ManagerSubstituteListStatusFilter
): string {
  return (
    MANAGER_SUBSTITUTE_STATUS_FILTER_OPTIONS.find(
      option => option.key === filter
    )?.label ?? '전체'
  )
}

/** 매니저 UI 필터 → API status (G5 기준) */
export const MANAGER_FILTER_TO_API_STATUS: Record<
  ManagerSubstituteListStatusFilter,
  SubstituteApiStatus[]
> = {
  all: [],
  pending: [SubstituteApiStatus.ACCEPTED],
  accepted: [SubstituteApiStatus.APPROVED],
  cancelled: [SubstituteApiStatus.REJECTED_BY_APPROVER],
}

export function resolveManagerApiStatuses(
  filter: ManagerSubstituteListStatusFilter
): SubstituteApiStatus[] {
  return MANAGER_FILTER_TO_API_STATUS[filter]
}
