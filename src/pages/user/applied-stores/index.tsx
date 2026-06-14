import { useState } from 'react'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import {
  AppliedStoreListItem,
  AppliedStoreDetailModal,
  useAppliedStoresViewModel,
  type AppliedStoreData,
} from '@/features/user'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'

export function AppliedStoresPage() {
  const [selectedStore, setSelectedStore] = useState<AppliedStoreData | null>(
    null
  )

  const {
    selectedFilter,
    filterLabel,
    isDropdownOpen,
    dropdownRef,
    filterOptions,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    cancelApplication,
    isCancelling,
  } = useAppliedStoresViewModel()

  const closeDetail = () => setSelectedStore(null)

  const handleCancel = () => {
    if (!selectedStore) return
    cancelApplication(selectedStore.id, { onSuccess: closeDetail })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="내가 지원한 가게" />
      </div>
      <div className="mx-auto w-full max-w-[390px] px-4 py-4">
        <div className="relative mb-2 flex justify-end" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-line-1 px-3 py-1.5 typography-body02-medium text-text-100"
            onClick={toggleDropdown}
          >
            {filterLabel}
            <DownIcon
              className={`size-4 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-line-1 bg-white shadow-md">
              {filterOptions.map(option => (
                <li key={option.key}>
                  <button
                    type="button"
                    className={`w-full px-4 py-2.5 text-left typography-body02-regular transition-colors hover:bg-main-100 ${
                      option.key === selectedFilter
                        ? 'text-main typography-body02-medium'
                        : 'text-text-100'
                    }`}
                    onClick={() => selectFilter(option.key)}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
              데이터를 불러오는 데 실패했습니다.
            </p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
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

            {shouldShowInfiniteListLoadMore(hasNextPage, totalCount) && (
              <MoreButton
                className="mt-6"
                label={isFetchingNextPage ? '불러오는 중...' : '더보기'}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              />
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
          onCancel={handleCancel}
          isCancelling={isCancelling}
        />
      )}
    </div>
  )
}
