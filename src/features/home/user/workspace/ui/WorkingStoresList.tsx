import { MoreButton } from '@/shared/ui/common/MoreButton'
import { useWorkingStoresListViewModel } from '@/features/home/user/workspace/hooks/useWorkingStoresListViewModel'
import {
  WorkingStoreCard,
  type WorkingStoreItem,
} from '@/features/home/user/workspace/ui/WorkingStoreCard'

interface WorkingStoresListProps {
  title?: string
  sortLabelLeft?: string
  sortLabelRight?: string
  selectedSort?: 'left' | 'right'
  stores: WorkingStoreItem[]
  onMoreClick?: () => void
}

export function WorkingStoresList({
  title = '근무중인 가게',
  sortLabelLeft = '이름 순',
  sortLabelRight = '근무 예정 순',
  selectedSort = 'right',
  stores,
  onMoreClick,
}: WorkingStoresListProps) {
  const { visibleStores } = useWorkingStoresListViewModel(stores)

  return (
    <section className="w-[358px] rounded-2xl bg-white py-6">
      <div className="flex items-center justify-between px-6">
        <h3 className="typography-headline01 text-text-100">{title}</h3>
        <div className="flex items-center gap-1">
          <p
            className={`typography-body02-regular ${
              selectedSort === 'left' ? 'text-text-90' : 'text-text-50'
            }`}
          >
            {sortLabelLeft}
          </p>
          <p className="typography-body02-regular text-text-50">|</p>
          <p
            className={`typography-body02-semibold ${
              selectedSort === 'right' ? 'text-text-90' : 'text-text-50'
            }`}
          >
            {sortLabelRight}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {visibleStores.map((store, index) => (
          <div key={store.workspaceId}>
            <WorkingStoreCard store={store} />
            {index < visibleStores.length - 1 ? (
              <div className="mx-1 h-px bg-line-1" />
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6 px-6">
        <MoreButton onClick={onMoreClick} />
      </div>
    </section>
  )
}

export type { WorkingStoresListProps, WorkingStoreItem }
