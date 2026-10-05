import type {
  SubstituteRequestStatus,
  SubstituteUiStatus,
  UserSubstituteListStatusFilter,
} from '@/features/user/substitute/types'

export type { UserSubstituteListStatusFilter } from '@/features/user/substitute/types'

export type SubstituteListFilters = {
  statusFilter: UserSubstituteListStatusFilter
}

export const USER_SUBSTITUTE_STATUS_ORDER: SubstituteUiStatus[] = [
  'pending',
  'accepted',
  'approved',
  'cancelled',
]

export const USER_SUBSTITUTE_STATUS_TITLE: Record<SubstituteUiStatus, string> =
  {
    pending: '요청됨',
    accepted: '수락됨',
    approved: '승인됨',
    cancelled: '취소됨',
  }

const ALL_FILTER_LABEL = '전체'

export const USER_SUBSTITUTE_STATUS_FILTER_OPTIONS: {
  key: UserSubstituteListStatusFilter
  label: string
}[] = [
  { key: 'all', label: ALL_FILTER_LABEL },
  ...USER_SUBSTITUTE_STATUS_ORDER.map(status => ({
    key: status,
    label: USER_SUBSTITUTE_STATUS_TITLE[status],
  })),
]

export function userStatusFilterLabel(
  filter: UserSubstituteListStatusFilter
): string {
  return filter === 'all'
    ? ALL_FILTER_LABEL
    : USER_SUBSTITUTE_STATUS_TITLE[filter]
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
