import BookmarkIcon from '@/assets/icons/alba/Bookmark.svg?react'

export type AlbaboxProps = {
  storeName: string
  title: string
  wageAmount: string
  timeRange: string
  workDays: string
  distance: string
  postedAgo: string
  saved: boolean
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
  saved,
  likeCount,
  onBookmarkClick,
}: AlbaboxProps) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-white py-4">
      <div className="flex items-start justify-between gap-3 px-4">
        <p className="typography-body02-semibold text-text-100">{storeName}</p>
        <button
          type="button"
          onClick={onBookmarkClick}
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

      <h3 className="typography-body01-semibold text-text-100 line-clamp-2 px-4">
        {title}
      </h3>

      <p className="typography-headline03 text-text-100 px-4">
        시급 {wageAmount}원
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-1 typography-body03-regular text-text-70 px-4">
        <span>{timeRange}</span>
        <span>{workDays}</span>
        <span>{distance}</span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line-2 px-4 pt-3 typography-body03-regular text-text-50">
        <span>{postedAgo}</span>
        {likeCount != null && likeCount !== '' && (
          <span className="text-text-70">좋아요 {likeCount}</span>
        )}
      </div>
    </article>
  )
}
