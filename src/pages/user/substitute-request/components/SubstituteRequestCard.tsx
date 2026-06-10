import type { SubstituteDirectionTab } from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import { Avatar } from '@/shared/ui/common/Avatar'
import { SubstituteRequestResponseActions } from '@/pages/user/substitute-request/components/SubstituteRequestResponseActions'
import { SubstituteRequestStatusBadge } from '@/pages/user/substitute-request/components/SubstituteRequestStatusBadge'
import type { UserSubstituteListItem } from '@/features/user/substitute/types'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'

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
      className={`flex h-[72px] w-full items-center gap-4 rounded-2xl border border-line-1 bg-white px-5 text-left transition-colors active:bg-bg-light${isClickable ? ' cursor-pointer' : ''}`}
    >
      <Avatar
        src={item.imageUrl}
        alt={item.displayName}
        className="border border-line-1"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <span className="min-w-0 flex-1 truncate typography-body01-semibold text-text-100">
            {item.displayName}
          </span>
          <WorkerRoleBadge role={item.role} />
        </div>
        <p className="mt-1 flex gap-2 typography-doc text-text-70">
          <span>대타 근무 예정일</span>
          <span>{item.scheduledDateLabel}</span>
        </p>
      </div>
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
  )
}
