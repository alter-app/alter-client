import {
  ApplicationStatusBadge,
  type ApplicationStatusBadgeProps,
} from '@/shared/ui/home/ApplicationStatusBadge'

interface AppliedStoreListItemProps {
  storeName: string
  status: ApplicationStatusBadgeProps['status']
  thumbnailUrl?: string
  onClick?: () => void
}

export function AppliedStoreListItem({
  storeName,
  status,
  thumbnailUrl,
  onClick,
}: AppliedStoreListItemProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex h-[72px] items-center rounded-2xl border border-line-1 bg-white px-6 ${
        onClick ? 'cursor-pointer transition-opacity active:opacity-80' : ''
      }`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[70px] bg-bg-dark">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={storeName}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <p className="ml-4 min-w-0 flex-1 truncate typography-headline03 text-text-90">
        {storeName}
      </p>
      <ApplicationStatusBadge status={status} className="ml-3 shrink-0" />
    </div>
  )
}

export type { AppliedStoreListItemProps }
