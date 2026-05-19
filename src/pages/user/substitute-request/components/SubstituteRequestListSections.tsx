import DownIcon from '@/assets/icons/home/chevron-down.svg?react'

import { SubstituteRequestCard } from '@/pages/user/substitute-request/components/SubstituteRequestCard'
import type { SubstituteDirectionTab } from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import type { SubstituteListSection } from '@/features/user/substitute/hooks/useUserSubstituteRequestsViewModel'
import type { UserSubstituteListItem } from '@/features/user/substitute/types'

interface SubstituteRequestListSectionsProps {
  sections: SubstituteListSection[]
  directionTab: SubstituteDirectionTab
  onItemClick: (item: UserSubstituteListItem) => void
  onAccept?: (item: UserSubstituteListItem) => void
  onReject?: (item: UserSubstituteListItem) => void
  actionsDisabled?: boolean
}

export function SubstituteRequestListSections({
  sections,
  directionTab,
  onItemClick,
  onAccept,
  onReject,
  actionsDisabled,
}: SubstituteRequestListSectionsProps) {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="typography-body02-regular text-text-70">
          대타 요청 내역이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sections.map(section => (
        <section key={section.key} className="px-4 py-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="typography-headline01 text-text-100">
              {section.title}
            </h2>
            {section.key === 'pending' ? (
              <button
                type="button"
                className="flex items-center gap-2 typography-body02-regular text-text-50"
                aria-label="필터"
              >
                전체
                <DownIcon className="size-4 text-text-50" aria-hidden />
              </button>
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
