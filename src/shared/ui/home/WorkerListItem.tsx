export type WorkerVariant = 'manager' | 'worker'

export interface WorkerListItemProps {
  name: string
  role: string
  variant?: WorkerVariant
  nextWorkDate?: string
  imageUrl?: string | null
  onOptions?: () => void
}

export interface WorkerListItemData extends WorkerListItemProps {
  id: string
}

function EllipsisIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="14" cy="9" r="1.5" fill="#828282" />
      <circle cx="14" cy="14" r="1.5" fill="#828282" />
      <circle cx="14" cy="19" r="1.5" fill="#828282" />
    </svg>
  )
}

export function WorkerListItem({
  name,
  role,
  variant = 'worker',
  nextWorkDate,
  imageUrl,
  onOptions,
}: WorkerListItemProps) {
  const badgeBg = variant === 'manager' ? 'bg-main-700' : 'bg-main-300'

  return (
    <div className="flex h-[70px] items-center justify-between rounded-2xl bg-white px-3 py-1">
      <div className="flex items-center gap-4">
        <div className="size-[38px] shrink-0 overflow-hidden rounded-full bg-bg-light">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="typography-body01-semibold text-text-100 whitespace-nowrap">
              {name}
            </span>
            <span
              className={`${badgeBg} typography-bg text-text-90 rounded-[80px] px-2 py-0.5 whitespace-nowrap`}
            >
              {role}
            </span>
          </div>

          {nextWorkDate && (
            <div className="flex gap-2">
              <span className="typography-doc text-text-70 whitespace-nowrap">
                다음 근무 예정일
              </span>
              <span className="typography-doc text-text-70 whitespace-nowrap">
                {nextWorkDate}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onOptions}
        className="shrink-0 rounded cursor-pointer"
        aria-label="더보기"
      >
        <EllipsisIcon />
      </button>
    </div>
  )
}
