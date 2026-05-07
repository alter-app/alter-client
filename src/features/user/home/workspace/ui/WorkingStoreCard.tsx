import { useWorkingStoreCardViewModel } from '@/features/user/home/workspace/hooks/useWorkingStoreCardViewModel'
import type { WorkingStoreItem } from '@/features/user/home/workspace/types/workingStore'
interface WorkingStoreCardProps {
  store: WorkingStoreItem
}

export function WorkingStoreCard({ store }: WorkingStoreCardProps) {
  const { dueText, nextWorkDate } = useWorkingStoreCardViewModel(store)

  return (
    <div className="flex h-[72px] items-center px-6">
      <div className="h-12 w-12 overflow-hidden rounded-[70px] bg-bg-dark">
        {store.thumbnailUrl ? (
          <img
            src={store.thumbnailUrl}
            alt={store.businessName}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="ml-4 min-w-0 flex-1">
        <p className="typography-headline03 truncate text-text-90">
          {store.businessName}
        </p>
        <div className="mt-0.5 flex items-center gap-1">
          <p className="typography-body02-regular text-text-70">
            다음 근무 예정일
          </p>
          <p className="typography-body02-regular text-text-70">
            {nextWorkDate}
          </p>
        </div>
      </div>
      <p className="typography-headline03 text-sub truncate">{dueText}</p>
    </div>
  )
}
