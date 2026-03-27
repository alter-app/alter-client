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
  className?: string
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M4 11h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4V4z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 22V11m0 11H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3m0 10 5-9a2 2 0 0 1 2-1h2.5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
  className = '',
}: AlbaboxProps) {
  return (
    <article
      className={`border-b border-line-1 bg-white py-6 last:border-b-0 ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate typography-body02-regular text-text-70">
          {storeName}
        </p>
        <p className="shrink-0 typography-body02-regular text-text-70">
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
          className={`shrink-0 p-0.5 ${saved ? 'text-main' : 'text-text-70'}`}
          aria-label={saved ? '북마크 해제' : '북마크'}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      <p className="mt-1 typography-body02-regular text-text-90">
        시급 <span className="text-sub">{wageAmount}</span>
      </p>

      <div
        className={`mt-3 flex gap-3 ${likeCount != null ? 'items-end justify-between' : 'items-center'}`}
      >
        <div className="min-w-0 flex flex-wrap items-center gap-x-4 gap-y-1 typography-body02-regular text-text-70">
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="shrink-0 text-text-70" />
            {timeRange}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="shrink-0 text-text-70" />
            {workDays}
          </span>
        </div>
        {likeCount != null && (
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-2 bg-white px-2.5 py-1 typography-body03-regular text-text-70">
            <ThumbUpIcon />
            <span>{likeCount}</span>
          </div>
        )}
      </div>
    </article>
  )
}
