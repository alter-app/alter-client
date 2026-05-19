// 진행 중인 공고 카드
import { MoreButton } from '@/shared/ui/common/MoreButton'
import clockIcon from '@/assets/icons/job-lookup-map/Clock.svg'
import calendarIcon from '@/assets/icons/job-lookup-map/Calendar.svg'

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

function parseWage(wage: string) {
  const match = wage.match(/(\d[\d,]*)/)

  if (!match || !match[1]) {
    return {
      prefix: '시급',
      amount: wage,
      suffix: '',
    }
  }

  const amount = match[1]
  const parts = wage.split(amount)
  const [rawPrefix = '', rawSuffix = ''] = parts

  return {
    prefix: rawPrefix.trim() || '시급',
    amount,
    suffix: rawSuffix.trim(),
  }
}

function parseDdayValue(dDay: string) {
  const value = Number(dDay.replace(/[^0-9]/g, ''))
  return Number.isNaN(value) ? null : value
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
  const dDayValue = parseDdayValue(posting.dDay)
  const isUrgent = dDayValue !== null && dDayValue <= 3
  const { prefix, amount, suffix } = parseWage(posting.wage)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-4 text-left transition-colors hover:bg-gray-50/50 ${!isLast ? 'border-b border-line-1' : ''}`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`inline-flex h-[22px] items-center rounded-[100px] px-2.5 typography-body03-semibold ${
            isUrgent ? 'bg-main-900 text-white' : 'bg-main-100 text-main-900'
          }`}
        >
          {posting.dDay}
        </span>
        <span className="line-clamp-1 typography-body01-semibold text-black">
          {posting.title}
        </span>
      </div>

      <div className="mb-1 flex items-center gap-0.5 typography-body02-regular text-text-90">
        <span>{prefix}</span>
        <span className="text-sub">{amount}</span>
        {suffix ? <span>{suffix}</span> : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 typography-body02-regular text-text-90">
        <span className="flex items-center gap-1.5">
          <img src={clockIcon} alt="" aria-hidden="true" className="size-4" />
          {posting.workHours}
        </span>
        <span className="flex items-center gap-1.5">
          <img
            src={calendarIcon}
            alt=""
            aria-hidden="true"
            className="size-4"
          />
          {posting.workDays}
        </span>
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
    <div className="flex flex-col overflow-hidden rounded-[16px] bg-white px-6 pt-8 pb-4 shadow-sm">
      <div className="flex flex-col">
        {postings.map((posting, index) => (
          <PostingRow
            key={posting.id}
            posting={posting}
            onClick={() => onPostingClick?.(posting)}
            isLast={index === postings.length - 1}
          />
        ))}
      </div>
      <div className="pt-[18px]">
        <MoreButton onClick={onViewMore} />
      </div>
    </div>
  )
}
