import BookmarkIcon from '@/assets/icons/alba/Bookmark.svg?react'
import CalendarIcon from '@/assets/icons/alba/Calendar.svg?react'
import ClockIcon from '@/assets/icons/alba/Clock.svg?react'
import ThumbUpIcon from '@/assets/icons/alba/Thumbsup.svg?react'

export type AlbaboxProps = {
  storeName: string
  title: string
  wageAmount: string
  timeRange: string
  workDays: string
  distance: string
  postedAgo: string
  saved?: boolean
  likeCount?: string
  onBookmarkClick?: () => void
}

export function Albabox({
  storeName,
  title,
  wageAmount,
  timeRange,
  workDays,
  distance,
  postedAgo,
  saved = false,
  likeCount,
  onBookmarkClick,
}: AlbaboxProps) {
  return (
    <article className="border-b border-line-1 bg-white py-6 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate typography-body02-semibold text-text-70">
          {storeName}
        </p>
        <p className=" typography-body02-regular text-text-70">
          {distance} · {postedAgo}
        </p>
      </div>

      <div className="mt-1 flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 typography-body01-semibold text-text-100">
          {title}
        </h3>
        <button
          type="button"
          onClick={onBookmarkClick}
          aria-label={saved ? '북마크 해제' : '북마크'}
        >
          <BookmarkIcon className="h-5 w-4 shrink-0" aria-hidden />
        </button>
      </div>

      <p className="mt-1 typography-body02-regular text-text-90">
        시급{' '}
        <span className="typography-body02-semibold text-sub ">
          {wageAmount}
        </span>
        원
      </p>

      <div className="mt-1 flex gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4  typography-body02-regular text-text-90">
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-4 w-4 shrink-0" aria-hidden />
            {timeRange}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 shrink-0" aria-hidden />
            {workDays}
          </span>
        </div>
        {likeCount != null && (
          <div className="inline-flex  items-center gap-1 rounded-full border border-line-2 bg-white px-2.5 py-1 typography-body03-regular text-text-70 shadow-sm shadow-black/5">
            <ThumbUpIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="typography-body02-semibold text-text-100 ">
              {likeCount}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
