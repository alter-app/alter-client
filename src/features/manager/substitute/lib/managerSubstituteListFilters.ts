import type { SubstituteListStatusFilter } from '@/features/user/substitute/lib/substituteListFilters'
import { SubstituteApiStatus } from '@/shared/types/substituteStatus'

export type ManagerSubstituteListFilters = {
  statusFilter: SubstituteListStatusFilter
}

/** 매니저 UI 필터 → API status (G5 기준) */
export const MANAGER_FILTER_TO_API_STATUS: Record<
  SubstituteListStatusFilter,
  SubstituteApiStatus[]
> = {
  all: [],
  pending: [SubstituteApiStatus.ACCEPTED],
  accepted: [SubstituteApiStatus.APPROVED],
  cancelled: [SubstituteApiStatus.REJECTED_BY_APPROVER],
}

export function resolveManagerApiStatuses(
  filter: SubstituteListStatusFilter
): SubstituteApiStatus[] {
  return MANAGER_FILTER_TO_API_STATUS[filter]
}
