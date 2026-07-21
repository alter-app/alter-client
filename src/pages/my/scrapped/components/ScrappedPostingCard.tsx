import type { KeyboardEvent } from 'react'
import BookmarkIcon from '@/assets/icons/job-lookup-map/Bookmark.svg?react'

export type ScrappedPostingCardProps = {
  storeName: string
  title: string
  wageAmount: string
  savedAgoLabel: string
  onBookmarkClick?: () => void
  onClick?: () => void
}

export function ScrappedPostingCard({
  storeName,
  title,
  wageAmount,
  savedAgoLabel,
  onBookmarkClick,
  onClick,
}: ScrappedPostingCardProps) {
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
      className={`rounded-2xl bg-white px-4 py-4 shadow-[0px_1px_4px_rgba(0,0,0,0.08)] ${
        isInteractive ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 typography-body02-regular text-text-70">
          {storeName}
        </p>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onBookmarkClick?.()
          }}
          aria-label="스크랩 해제"
          className="-m-1 rounded-md p-1 text-main [&_path]:fill-main [&_path]:stroke-main"
        >
          <BookmarkIcon className="h-5 w-4" aria-hidden />
        </button>
      </div>

      <h3 className="mt-1 typography-body01-semibold text-text-100">{title}</h3>

      <p className="mt-1.5 typography-body02-regular text-text-70">
        시급 {wageAmount}원
      </p>

      <p className="mt-3 typography-body03-regular text-text-50">
        {savedAgoLabel}
      </p>
    </article>
  )
}
