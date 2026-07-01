import type { SubstituteDirectionTab } from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import { SubstituteRequestResponseActions } from '@/pages/user/substitute-request/components/SubstituteRequestResponseActions'
import { SubstituteRequestStatusBadge } from '@/pages/user/substitute-request/components/SubstituteRequestStatusBadge'
import type { UserSubstituteListItem } from '@/features/user/substitute/types'

interface SubstituteRequestCardProps {
  item: UserSubstituteListItem
  directionTab: SubstituteDirectionTab
  onClick?: () => void
  onAccept?: () => void
  onReject?: () => void
  actionsDisabled?: boolean
}

export function SubstituteRequestCard({
  item,
  directionTab,
  onClick,
  onAccept,
  onReject,
  actionsDisabled,
}: SubstituteRequestCardProps) {
  const showResponseActions =
    directionTab === 'received' &&
    item.uiStatus === 'pending' &&
    onAccept != null &&
    onReject != null

  const isClickable = onClick != null

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={`w-full rounded-2xl border border-line-1 bg-white p-4 text-left transition-colors active:bg-bg-light${
        isClickable ? ' cursor-pointer' : ''
      }`}
    >
      <p className="truncate typography-body01-semibold text-text-100">
        {item.storeName}
      </p>

      <p className="mt-2 typography-body02-regular text-text-100">
        <span className="typography-body02-semibold">
          {item.scheduleDateTitle}
        </span>
        <span className="text-text-70"> · {item.scheduleTimeRangeLabel}</span>
      </p>

      <p className="mt-1 typography-body02-regular text-text-70">
        {item.positionLabel}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="typography-body03-regular text-text-50">
          {item.createdAtLabel}
        </span>
        {showResponseActions ? (
          <SubstituteRequestResponseActions
            onAccept={onAccept}
            onReject={onReject}
            disabled={actionsDisabled}
          />
        ) : (
          <SubstituteRequestStatusBadge
            uiStatus={item.uiStatus}
            label={item.statusLabel}
          />
        )}
      </div>
    </div>
  )
}
