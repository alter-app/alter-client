import type { PostingStatus } from '@/features/manager/posting/types/posting'

interface PostingDetailActionBarProps {
  status: PostingStatus
  isClosing: boolean
  onEdit: () => void
  onClosePosting: () => void
}

export function PostingDetailActionBar({
  status,
  isClosing,
  onEdit,
  onClosePosting,
}: PostingDetailActionBarProps) {
  const isClosed = status === 'CLOSED'
  const isInactive = status !== 'OPEN'

  return (
    <div className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[428px] -translate-x-1/2 gap-2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
      {isClosed ? null : (
        <button
          type="button"
          onClick={onEdit}
          className="h-12 flex-1 rounded-xl bg-main typography-bt text-white transition-all hover:brightness-[0.94] active:brightness-[0.88]"
        >
          수정
        </button>
      )}
      <button
        type="button"
        onClick={onClosePosting}
        disabled={isInactive || isClosing}
        className="h-12 flex-1 rounded-xl border border-line-1 bg-white typography-bt text-text-90 transition-colors hover:bg-bg-light disabled:cursor-not-allowed disabled:text-text-50"
      >
        {isInactive ? '마감됨' : '모집 마감'}
      </button>
    </div>
  )
}
