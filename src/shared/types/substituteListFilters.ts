export type SubstituteListUiStatus = 'pending' | 'accepted' | 'cancelled'

export type SubstituteListStatusFilter = 'all' | SubstituteListUiStatus

export const SUBSTITUTE_STATUS_FILTER_OPTIONS: {
  key: SubstituteListStatusFilter
  label: string
}[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '요청됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

export function statusFilterLabel(filter: SubstituteListStatusFilter): string {
  return (
    SUBSTITUTE_STATUS_FILTER_OPTIONS.find(option => option.key === filter)
      ?.label ?? '전체'
  )
}
