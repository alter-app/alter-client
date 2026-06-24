import type {
  SubstituteRequestStatus,
  SubstituteUiStatus,
} from '@/features/user/substitute/types'

export type SubstituteListStatusFilter = 'all' | SubstituteUiStatus

export type SubstituteListFilters = {
  statusFilter: SubstituteListStatusFilter
}

export const SUBSTITUTE_STATUS_FILTER_OPTIONS: {
  key: SubstituteListStatusFilter
  label: string
}[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '요청됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

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

export function statusFilterLabel(filter: SubstituteListStatusFilter): string {
  return (
    SUBSTITUTE_STATUS_FILTER_OPTIONS.find(option => option.key === filter)
      ?.label ?? '전체'
  )
}
