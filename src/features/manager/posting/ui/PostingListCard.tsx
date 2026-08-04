import CalendarIcon from '@/assets/icons/posting/Calendar.svg?react'
import ClockIcon from '@/assets/icons/posting/Clock.svg?react'
import { ManagerPostingStatusBadge } from '@/features/manager/posting/ui/ManagerPostingStatusBadge'
import {
  formatTimeRange,
  formatWorkingDays,
  PAYMENT_TYPE_LABEL,
  type PostingListItem,
} from '@/features/manager/posting/types/posting'

interface PostingListCardProps {
  posting: PostingListItem
  onClick: () => void
}

export function PostingListCard({ posting, onClick }: PostingListCardProps) {
  const firstSchedule = posting.schedules[0]

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-colors hover:bg-bg-light/60"
    >
      <div className="flex flex-col gap-1.5 px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 typography-body01-semibold text-text-100">
            {posting.title}
          </h3>
          <ManagerPostingStatusBadge
            status={posting.status}
            className="shrink-0"
          />
        </div>

        <p className="typography-body03-regular text-text-70">
          {posting.workspaceName} · {posting.businessType}
        </p>

        {firstSchedule ? (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 typography-body03-regular text-text-90">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-4 text-main" />
              {formatWorkingDays(firstSchedule.workingDays)}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-4 text-main" />
              {formatTimeRange(firstSchedule.startTime, firstSchedule.endTime)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-line-1 px-4 py-3">
        <span className="typography-body03-regular text-text-70">
          {PAYMENT_TYPE_LABEL[posting.paymentType]}
        </span>
        <span className="typography-body01-semibold text-text-100">
          {posting.payAmount.toLocaleString('ko-KR')}원
        </span>
      </div>
    </button>
  )
}
