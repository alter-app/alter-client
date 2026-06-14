import { MoreButton } from '@/shared/ui/common/MoreButton'
import {
  WorkingStoreCard,
  type WorkingStoreItem,
  useWorkingStoresListViewModel,
} from '@/features/user'

interface WorkingStoresListProps {
  title?: string
  stores: WorkingStoreItem[]
  onMoreClick?: () => void
  onJoinWorkspaceClick?: () => void
}

export function WorkingStoresList({
  title = '근무중인 가게',
  stores,
  onMoreClick,
  onJoinWorkspaceClick,
}: WorkingStoresListProps) {
  const { visibleStores } = useWorkingStoresListViewModel(stores)

  return (
    <section className="w-[358px] rounded-2xl bg-white py-6">
      <div className="flex items-center justify-between px-6">
        <h3 className="typography-headline01 text-text-100">{title}</h3>
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
        {stores.length >= 4 && <MoreButton onClick={onMoreClick} />}
        {onJoinWorkspaceClick ? (
          <button
            type="button"
            className="mt-3 w-full typography-body02-semibold text-main"
            onClick={onJoinWorkspaceClick}
          >
            받은 업장 초대 확인
          </button>
        ) : null}
      </div>
    </section>
  )
}

export type { WorkingStoresListProps, WorkingStoreItem }
