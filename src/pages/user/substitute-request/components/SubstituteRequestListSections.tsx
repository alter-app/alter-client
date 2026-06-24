import { SubstituteRequestCard } from '@/pages/user/substitute-request/components/SubstituteRequestCard'
import { SubstituteStatusFilterDropdown } from '@/pages/user/substitute-request/components/SubstituteStatusFilterDropdown'
import type { SubstituteDirectionTab } from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import type { SubstituteListSection } from '@/features/user/substitute/hooks/useUserSubstituteRequestsViewModel'
import {
  statusFilterLabel,
  type SubstituteListStatusFilter,
} from '@/features/user/substitute/lib/substituteListFilters'
import type { UserSubstituteListItem } from '@/features/user/substitute/types'

interface SubstituteRequestListSectionsProps {
  sections: SubstituteListSection[]
  directionTab: SubstituteDirectionTab
  statusFilter?: SubstituteListStatusFilter
  onStatusFilterChange?: (value: SubstituteListStatusFilter) => void
  onItemClick: (item: UserSubstituteListItem) => void
  onAccept?: (item: UserSubstituteListItem) => void
  onReject?: (item: UserSubstituteListItem) => void
  actionsDisabled?: boolean
}

export function SubstituteRequestListSections({
  sections,
  directionTab,
  statusFilter,
  onStatusFilterChange,
  onItemClick,
  onAccept,
  onReject,
  actionsDisabled,
}: SubstituteRequestListSectionsProps) {
  const showStatusFilter = statusFilter != null && onStatusFilterChange != null

  if (sections.length === 0) {
    return (
      <div className="flex flex-col">
        {showStatusFilter ? (
          <div className="flex items-center justify-between px-4 pb-2 pt-6">
            <h2 className="typography-headline01 text-text-100">
              {statusFilterLabel(statusFilter)}
            </h2>
            <SubstituteStatusFilterDropdown
              value={statusFilter}
              onChange={onStatusFilterChange}
            />
          </div>
        ) : null}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="typography-body02-regular text-text-70">
            대타 요청 내역이 없습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sections.map((section, index) => (
        <section key={section.key} className="px-4 py-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="typography-headline01 text-text-100">
              {section.title}
            </h2>
            {showStatusFilter && index === 0 ? (
              <SubstituteStatusFilterDropdown
                value={statusFilter}
                onChange={onStatusFilterChange}
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            {section.items.map(item => (
              <SubstituteRequestCard
                key={item.id}
                item={item}
                directionTab={directionTab}
                onClick={() => onItemClick(item)}
                onAccept={onAccept != null ? () => onAccept(item) : undefined}
                onReject={onReject != null ? () => onReject(item) : undefined}
                actionsDisabled={actionsDisabled}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
