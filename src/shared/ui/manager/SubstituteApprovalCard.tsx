// 대타 승인 요청 카드

export type SubstituteRequestStatus = 'accepted' | 'pending'

export interface SubstituteRequestItem {
  id: string
  name: string
  role: string
  dateRange: string
  status: SubstituteRequestStatus
  imageUrl?: string | null
}

interface SubstituteApprovalCardProps {
  requests: SubstituteRequestItem[]
  onViewMore?: () => void
  onRequestClick?: (item: SubstituteRequestItem) => void
}

const statusConfig: Record<
  SubstituteRequestStatus,
  { label: string; className: string }
> = {
  accepted: {
    label: '수락됨',
    className:
      'bg-[#E8F5F1] border-[#3A9982]/30 text-[#3A9982] typography-body03-semibold',
  },
  pending: {
    label: '대기중',
    className:
      'bg-amber-50 border-amber-300/50 text-amber-700 typography-body03-semibold',
  },
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
  const config = statusConfig[item.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-4 text-left hover:bg-gray-50/50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
            aria-hidden
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="typography-body01-semibold text-gray-900">
            {item.name}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#E0F2E0] text-gray-900 typography-bg">
            {item.role}
          </span>
        </div>
        <p className="typography-body03-regular text-gray-500 mt-0.5">
          {item.dateRange}
        </p>
      </div>
      <span
        className={`shrink-0 px-3 py-1.5 rounded-lg border ${config.className}`}
      >
        {config.label}
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
    <div className="bg-white rounded-[16px] shadow-sm overflow-hidden flex flex-col">
      <div className="px-4">
        {requests.map((item, index) => (
          <RequestRow
            key={item.id}
            item={item}
            onClick={() => onRequestClick?.(item)}
            isLast={index === requests.length - 1}
          />
        ))}
      </div>
      <div className="px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={onViewMore}
          className="w-full py-3 rounded-[8px] border border-gray-200 bg-white typography-body02-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          더보기
        </button>
      </div>
    </div>
  )
}
