import { Skeleton } from '@/shared/ui/common/Skeleton'

const SKELETON_ROWS = 6

export function ChatRoomListSkeleton() {
  return (
    <div aria-busy>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-line-1 px-4 py-3"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface ChatRoomListEmptyProps {
  title: string
  description: string
}

export function ChatRoomListEmpty({
  title,
  description,
}: ChatRoomListEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-20 text-center">
      <p className="typography-body01-semibold text-text-100">{title}</p>
      <p className="typography-body02-regular text-text-70">{description}</p>
    </div>
  )
}

interface ChatRoomListErrorProps {
  onRetry: () => void
}

export function ChatRoomListError({ onRetry }: ChatRoomListErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <p className="typography-body02-regular text-text-70">
        목록을 불러오지 못했어요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="h-11 rounded-[12px] border border-line-2 px-6 typography-body02-semibold text-text-100"
      >
        다시 시도
      </button>
    </div>
  )
}
