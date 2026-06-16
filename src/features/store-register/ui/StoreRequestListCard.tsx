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
      className="block w-full rounded-xl border border-line-1 bg-white p-4 text-left transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate typography-body01-semibold text-text-100">
          {item.businessName}
        </p>
        <StoreRequestStatusBadge status={item.status} />
      </div>
      <p className="mt-2 truncate typography-body02-regular text-text-70">
        {item.fullAddress}
      </p>
      <p className="mt-1.5 typography-body03-regular text-text-50">
        {formatRequestDate(item.createdAt)} 신청
      </p>
    </button>
  )
}
