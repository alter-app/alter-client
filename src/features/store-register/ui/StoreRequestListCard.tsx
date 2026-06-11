import { formatRequestDate } from '@/features/store-register/lib/formatDate'
import { StoreRequestStatusBadge } from '@/features/store-register/ui/StoreRequestStatusBadge'
import type { WorkspaceRequestListItemDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  item: WorkspaceRequestListItemDto
  onClick: () => void
}

/** 신청 내역 목록의 카드 한 건 */
export function StoreRequestListCard({ item, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 truncate typography-body01-semibold text-text-100">
          {item.businessName}
        </p>
        <StoreRequestStatusBadge status={item.status} />
      </div>
      <p className="line-clamp-2 typography-body02-regular text-text-70">
        {item.fullAddress}
      </p>
      <p className="typography-body02-regular text-text-50">
        신청일 {formatRequestDate(item.createdAt)}
      </p>
    </button>
  )
}
