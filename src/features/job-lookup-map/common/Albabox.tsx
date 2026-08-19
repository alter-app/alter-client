import type { KeyboardEvent } from 'react'
import BookmarkIcon from '@/assets/icons/job-lookup-map/Bookmark.svg?react'
import CalendarIcon from '@/assets/icons/job-lookup-map/Calendar.svg?react'
import ClockIcon from '@/assets/icons/job-lookup-map/Clock.svg?react'
import ThumbsupIcon from '@/assets/icons/job-lookup-map/Thumbsup.svg?react'

export type AlbaboxProps = {
  storeName: string
  title: string
  wageAmount: string
  timeRange: string
  workDays: string
  town: string
  postedAgo: string
  saved: boolean
  likeCount?: string
  onBookmarkClick?: () => void
  onClick?: () => void
}

export function Albabox({
  storeName,
  title,
  wageAmount,
  timeRange,
  workDays,
  town,
  postedAgo,
  saved,
  likeCount,
  onBookmarkClick,
  onClick,
}: AlbaboxProps) {
  const isInteractive = onClick != null

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <article
      className={`border-b border-line-1 py-5 last:border-b-0 ${isInteractive ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="typography-body02-semibold text-text-70">{storeName}</p>
        <div className="flex items-center gap-1 typography-body02-regular">
          <span className="text-text-70">{town}</span>
          <span className="text-text-50">·</span>
          <span className="text-text-70">{postedAgo}</span>
        </div>
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-2">
        <h3 className="typography-body01-semibold line-clamp-2 flex-1 text-text-100">
          {title}
        </h3>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onBookmarkClick?.()
          }}
          aria-label={saved ? '북마크 해제' : '북마크'}
          className={`shrink-0 p-1 -m-1 rounded-md transition-colors ${
            saved
              ? 'text-main [&_path]:fill-main [&_path]:stroke-main'
              : 'text-text-50 hover:text-text-70'
          }`}
        >
          <BookmarkIcon className="h-5 w-4" aria-hidden />
        </button>
      </div>

      <p className="mt-2 typography-body02-regular text-text-90">
        시급 <span className="font-medium text-sub">{wageAmount}</span>원
      </p>

      <div className="mt-2.5 flex items-end justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 typography-body02-regular text-text-90">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-5 w-5" aria-hidden />
            <span>{timeRange}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <CalendarIcon className="h-5 w-5" aria-hidden />
            <span>{workDays}</span>
          </div>
        </div>
        {likeCount != null && likeCount !== '' && (
          <div className="inline-flex h-6 items-center gap-1 rounded-xl border border-line-2 bg-white px-2 shadow-[0px_1px_4px_rgba(0,0,0,0.18)]">
            <ThumbsupIcon className="h-3 w-3 shrink-0" aria-hidden />
            <span className="typography-body02-semibold text-text-100 leading-none">
              {likeCount}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
