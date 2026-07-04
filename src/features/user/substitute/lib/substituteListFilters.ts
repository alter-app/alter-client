import type { SubstituteListStatusFilter } from '@/shared/types/substituteListFilters'

import type { SubstituteRequestStatus } from '@/features/user/substitute/types'

export type { SubstituteListStatusFilter } from '@/shared/types/substituteListFilters'

export type SubstituteListFilters = {
  statusFilter: SubstituteListStatusFilter
}

export const FILTER_TO_API_STATUS: Record<
  SubstituteListStatusFilter,
  SubstituteRequestStatus[]
> = {
  all: [],
  pending: ['PENDING'],
  accepted: ['ACCEPTED', 'APPROVED'],
  cancelled: [
    'CANCELLED',
    'REJECTED_BY_TARGET',
    'REJECTED_BY_APPROVER',
    'EXPIRED',
  ],
}

export function resolveApiStatuses(
  filter: SubstituteListStatusFilter
): SubstituteRequestStatus[] {
  return FILTER_TO_API_STATUS[filter]
}
