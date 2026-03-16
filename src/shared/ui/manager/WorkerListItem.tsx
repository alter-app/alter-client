// 근무자 목록

export type WorkerRole = '매니저' | '알바'

export interface WorkerListItemProps {
  name: string
  role: WorkerRole
  nextWorkDate: string
  imageUrl?: string | null
  onOptions?: () => void
}

export interface WorkerListItemData extends WorkerListItemProps {
  id: string
}

function EllipsisIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-600"
      aria-hidden
    >
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function WorkerListItem({
  name,
  role,
  nextWorkDate,
  imageUrl,
  onOptions,
}: WorkerListItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 bg-white">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
            aria-hidden
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="typography-body01-semibold text-gray-900">
            {name}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#E0F2E0] text-gray-900 typography-bg">
            {role}
          </span>
        </div>
        <p className="typography-body03-regular text-gray-500 mt-0.5">
          다음 근무 예정일 {nextWorkDate}
        </p>
      </div>
      <button
        type="button"
        onClick={onOptions}
        className="p-1 shrink-0 -m-1 rounded cursor-pointer"
        aria-label="더보기"
      >
        <EllipsisIcon />
      </button>
    </div>
  )
}
