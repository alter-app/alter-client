import { MoreButton } from '@/shared/ui/common/MoreButton'
import { AppliedStoreCard } from '@/features/user/home/applied-stores/ui/AppliedStoreCard'

interface AppliedStoreItem {
  id: number | string
  storeName: string
  status: 'applied' | 'rejected'
}

interface AppliedStoreListProps {
  title?: string
  recentLabel?: string
  stores: AppliedStoreItem[]
  onMoreClick?: () => void
}

export function AppliedStoreList({
  title = '내가 지원한 가게',
  recentLabel,
  stores,
  onMoreClick,
}: AppliedStoreListProps) {
  const visibleStores = stores.slice(0, 5)
  const rightLabel = recentLabel ?? `최근 지원한 ${visibleStores.length}개`

  return (
    <section className="w-[358px] rounded-2xl bg-white py-6">
      <div className="flex justify-between px-6">
        <h3 className="typography-headline01 text-text-100">{title}</h3>
        <p className="typography-body02-regular text-text-50 mt-2 mb-[3px]">
          {rightLabel}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto scrollbar-hide px-6">
        <div className="flex min-w-max gap-3">
          {visibleStores.map(store => (
            <AppliedStoreCard
              key={store.id}
              storeName={store.storeName}
              status={store.status}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 px-6">
        <MoreButton onClick={onMoreClick} />
      </div>
    </section>
  )
}

export type { AppliedStoreListProps, AppliedStoreItem }
