import { ApplicationStatusBadge } from '@/shared/ui/home/ApplicationStatusBadge'

interface AppliedStoreListItemProps {
  storeName: string
  status: 'applied' | 'rejected'
  thumbnailUrl?: string
}

export function AppliedStoreListItem({
  storeName,
  status,
  thumbnailUrl,
}: AppliedStoreListItemProps) {
  return (
    <div className="flex h-[72px] items-center rounded-2xl border border-line-1 bg-white px-6">
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
