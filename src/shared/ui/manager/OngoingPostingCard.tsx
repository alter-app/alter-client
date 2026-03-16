// 진행 중인 공고 카드

export interface JobPostingItem {
  id: string
  dDay: string
  title: string
  wage: string
  workHours: string
  workDays: string
}

interface OngoingPostingCardProps {
  postings: JobPostingItem[]
  onViewMore?: () => void
  onPostingClick?: (posting: JobPostingItem) => void
}

function PostingRow({
  posting,
  onClick,
  isLast,
}: {
  posting: JobPostingItem
  onClick?: () => void
  isLast: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left py-4 hover:bg-gray-50/50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D0F2E5] text-gray-800 typography-bg">
          {posting.dDay}
        </span>
        <span className="typography-body01-semibold text-gray-900 line-clamp-1">
          {posting.title}
        </span>
      </div>
      <p className="typography-body02-regular text-gray-900 mb-1">
        {posting.wage}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 typography-body03-regular text-gray-900">
        <span className="flex items-center gap-1.5">{posting.workHours}</span>
        <span className="flex items-center gap-1.5">{posting.workDays}</span>
      </div>
    </button>
  )
}

export function OngoingPostingCard({
  postings,
  onViewMore,
  onPostingClick,
}: OngoingPostingCardProps) {
  return (
    <div className="bg-white rounded-[16px] shadow-sm overflow-hidden flex flex-col py-4">
      <div className="px-4">
        {postings.map((posting, index) => (
          <PostingRow
            key={posting.id}
            posting={posting}
            onClick={() => onPostingClick?.(posting)}
            isLast={index === postings.length - 1}
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
