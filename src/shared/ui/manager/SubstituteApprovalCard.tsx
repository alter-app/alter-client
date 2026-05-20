// 대타 승인 요청 카드
import { MoreButton } from '@/shared/ui/common/MoreButton'
import type { WorkerRole } from '@/shared/types/workerRole'
import {
  SUBSTITUTE_STATUS_LABEL,
  type SubstituteApiStatus,
} from '@/shared/types/substituteStatus'

export type SubstituteRequestStatus = 'accepted' | 'pending' | 'cancelled'

export interface SubstituteRequestItem {
  id: string
  name: string
  role: string
  workerRole: WorkerRole
  dateRange: string
  scheduledDate: string
  status: SubstituteRequestStatus
  imageUrl?: string | null
  rawStatus?: SubstituteApiStatus
}

interface SubstituteApprovalCardProps {
  requests: SubstituteRequestItem[]
  onViewMore?: () => void
  onRequestClick?: (item: SubstituteRequestItem) => void
}

const statusBadgeClass: Record<SubstituteRequestStatus, string> = {
  accepted: 'border-main bg-main-100 text-main typography-body02-semibold',
  pending:
    'border-warning bg-warning-100 text-warning typography-body02-semibold',
  cancelled: 'border-line-1 bg-bg-dark text-text-50 typography-body02-semibold',
}

function resolveStatusLabel(item: SubstituteRequestItem): string {
  if (item.rawStatus != null) {
    return SUBSTITUTE_STATUS_LABEL[item.rawStatus]
  }
  return item.status === 'accepted' ? '승인' : '대기중'
}

function RequestRow({
  item,
  onClick,
  isLast,
}: {
  item: SubstituteRequestItem
  onClick?: () => void
  isLast: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-gray-50/50 ${!isLast ? 'border-b border-line-1' : ''}`}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-1 bg-bg-light">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
              aria-hidden
            />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="typography-body01-semibold text-black">
              {item.name}
            </span>
            <span className="inline-flex h-5 items-center rounded-[80px] bg-main-300 px-2 typography-bg text-text-90">
              {item.role}
            </span>
          </div>
          <p className="mt-0.5 typography-body02-regular text-text-90">
            {item.dateRange}
          </p>
        </div>
      </div>
      <span
        className={`inline-flex h-7 min-w-[69px] shrink-0 items-center justify-center rounded-[60px] border px-3 ${statusBadgeClass[item.status]}`}
      >
        {resolveStatusLabel(item)}
      </span>
    </button>
  )
}

export function SubstituteApprovalCard({
  requests,
  onViewMore,
  onRequestClick,
}: SubstituteApprovalCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[16px] bg-white px-6 pb-4 pt-8 shadow-sm">
      <div className="flex flex-col">
        {requests.map((item, index) => (
          <RequestRow
            key={item.id}
            item={item}
            onClick={() => onRequestClick?.(item)}
            isLast={index === requests.length - 1}
          />
        ))}
      </div>
      <div className="pt-[14px]">
        <MoreButton onClick={onViewMore} />
      </div>
    </div>
  )
}
