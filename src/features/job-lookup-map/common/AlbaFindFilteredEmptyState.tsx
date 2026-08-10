import MappinMutedIcon from '@/assets/icons/job-lookup-map/MappinMuted.svg?react'

type AlbaFindFilteredEmptyStateProps = {
  title?: string
  description?: string
  actionLabel: string
  onAction: () => void
}

export function AlbaFindFilteredEmptyState({
  title = '이 지역에 공고가 없어요',
  description = '다른 지역을 선택하거나 조건을 바꿔보세요',
  actionLabel,
  onAction,
}: AlbaFindFilteredEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-dark">
        <MappinMutedIcon className="size-7" aria-hidden />
      </div>
      <p className="mt-4 text-center typography-body01-semibold text-text-100">
        {title}
      </p>
      <p className="mt-1 text-center typography-body02-regular text-text-50">
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 h-11 rounded-2xl border border-main px-5 typography-body02-semibold text-main"
      >
        {actionLabel}
      </button>
    </div>
  )
}
