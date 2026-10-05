import type {
  SubstituteRequestStatus,
  UserSubstituteListStatusFilter,
} from '@/features/user/substitute/types'

export type { UserSubstituteListStatusFilter } from '@/features/user/substitute/types'

export type SubstituteListFilters = {
  statusFilter: UserSubstituteListStatusFilter
}

export const USER_SUBSTITUTE_STATUS_FILTER_OPTIONS: {
  key: UserSubstituteListStatusFilter
  label: string
}[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '요청됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'approved', label: '승인됨' },
  { key: 'cancelled', label: '취소됨' },
]

export function userStatusFilterLabel(
  filter: UserSubstituteListStatusFilter
): string {
  return (
    USER_SUBSTITUTE_STATUS_FILTER_OPTIONS.find(option => option.key === filter)
      ?.label ?? '전체'
  )
}

export const FILTER_TO_API_STATUS: Record<
  UserSubstituteListStatusFilter,
  SubstituteRequestStatus[]
> = {
  all: [],
  pending: ['PENDING'],
  accepted: ['ACCEPTED'],
  approved: ['APPROVED'],
  cancelled: [
    'CANCELLED',
    'REJECTED_BY_TARGET',
    'REJECTED_BY_APPROVER',
    'EXPIRED',
  ],
}

export function resolveApiStatuses(
  filter: UserSubstituteListStatusFilter
): SubstituteRequestStatus[] {
  return FILTER_TO_API_STATUS[filter]
}
