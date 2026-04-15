import { useState } from 'react'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AppliedStoreListItem } from '@/features/home/user/applied-stores/ui/AppliedStoreListItem'
import { AppliedStoreDetailModal } from '@/features/home/user/applied-stores/ui/AppliedStoreDetailModal'
import { useAppliedStoresViewModel } from '@/features/home/user/applied-stores/hooks/useAppliedStoresViewModel'
import type { AppliedStoreData } from '@/features/home/user/applied-stores/types/appliedStore'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'

export function AppliedStoresPage() {
  const [selectedStore, setSelectedStore] = useState<AppliedStoreData | null>(null)

  const {
    filterLabel,
    isDropdownOpen,
    dropdownRef,
    filterOptions,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAppliedStoresViewModel()

  const closeDetail = () => setSelectedStore(null)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="내가 지원한 가게" />
      <div className="mx-auto w-full max-w-[390px] px-4 py-4">
        <div className="relative mb-2 flex justify-end" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 typography-body02-regular text-text-90"
            onClick={toggleDropdown}
          >
            {filterLabel}
            <DownIcon className="size-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-[98px] overflow-hidden rounded-2xl bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)]">
              {filterOptions.map((option, index) => (
                <button
                  key={option.key}
                  type="button"
                  className={`flex h-10 w-full items-center px-4 typography-body02-regular text-text-100 ${
                    index < filterOptions.length - 1 ? 'border-b border-line-2' : ''
                  }`}
                  onClick={() => selectFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="typography-body02-regular text-text-70">로딩 중...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center py-10">
            <p className="typography-body02-regular text-text-70">
              데이터를 불러오는 데 실패했습니다.
            </p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex justify-center py-10">
            <p className="typography-body02-regular text-text-70">
              지원 내역이 없습니다.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-10">
              {grouped.map(section => (
                <section key={section.key}>
                  <h2 className="mb-4 typography-headline01 text-text-100">
                    {section.label}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {section.stores.map(store => (
                      <AppliedStoreListItem
                        key={store.id}
                        storeName={store.storeName}
                        status={getCardStatus(store.status)}
                        thumbnailUrl={store.thumbnailUrl}
                        onClick={() => setSelectedStore(store)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {hasNextPage && (
              <button
                type="button"
                className="typography-body02-regular mt-6 w-full py-3 text-center text-text-70"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            )}
          </>
        )}
      </div>

      {selectedStore?.applicationDetail && (
        <AppliedStoreDetailModal
          isOpen
          onClose={closeDetail}
          storeName={selectedStore.storeName}
          detail={selectedStore.applicationDetail}
          showCancelButton={selectedStore.status === 'submitted'}
          onCancel={closeDetail}
        />
      )}
    </div>
  )
}
