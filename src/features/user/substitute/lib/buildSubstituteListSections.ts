import {
  USER_SUBSTITUTE_STATUS_ORDER,
  USER_SUBSTITUTE_STATUS_TITLE,
} from '@/features/user/substitute/lib/substituteListFilters'
import type {
  SubstituteUiStatus,
  UserSubstituteListItem,
  UserSubstituteListStatusFilter,
} from '@/features/user/substitute/types'

export type SubstituteListSection = {
  key: SubstituteUiStatus
  title: string
  items: UserSubstituteListItem[]
}

export function buildSubstituteListSections(
  items: UserSubstituteListItem[],
  statusFilter: UserSubstituteListStatusFilter
): SubstituteListSection[] {
  if (statusFilter !== 'all') {
    return [
      {
        key: statusFilter,
        title: USER_SUBSTITUTE_STATUS_TITLE[statusFilter],
        items,
      },
    ].filter(section => section.items.length > 0)
  }

  const grouped = new Map<SubstituteUiStatus, UserSubstituteListItem[]>()
  for (const status of USER_SUBSTITUTE_STATUS_ORDER) {
    grouped.set(status, [])
  }
  for (const item of items) {
    grouped.get(item.uiStatus)?.push(item)
  }
  return USER_SUBSTITUTE_STATUS_ORDER.map(status => ({
    key: status,
    title: USER_SUBSTITUTE_STATUS_TITLE[status],
    items: grouped.get(status) ?? [],
  })).filter(section => section.items.length > 0)
}
