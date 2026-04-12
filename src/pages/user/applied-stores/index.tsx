import { useState } from 'react'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AppliedStoreListItem } from '@/features/home/user/ui/AppliedStoreListItem'
import { AppliedStoreDetailModal } from '@/features/home/user/ui/AppliedStoreDetailModal'
import { useAppliedStoresViewModel } from '@/features/home/user/hooks/useAppliedStoresViewModel'
import type {
  AppliedApplicationDetail,
  AppliedStoreData,
} from '@/features/home/user/types/appliedStore'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'

const SAMPLE_APPLICATION_DETAIL: AppliedApplicationDetail = {
  selectedWeekdays: ['수', '금'],
  timeRangeLabel: '18:00~20:00 (4시간)',
  selfIntroduction: '안녕하세요. 돈주세요. 일 대충할건데 돈은 많이 주세요.',
}

const INITIAL_STORES: AppliedStoreData[] = [
  {
    id: 1,
    storeName: '출근하기 싫은 가게 부천점',
    status: 'submitted',
    filterType: 'completed',
    applicationDetail: SAMPLE_APPLICATION_DETAIL,
  },
  {
    id: 2,
    storeName: '집에 가고 싶은 가게 부천점',
    status: 'submitted',
    filterType: 'completed',
    applicationDetail: {
      ...SAMPLE_APPLICATION_DETAIL,
      selectedWeekdays: ['월', '화'],
      timeRangeLabel: '10:00~14:00 (4시간)',
    },
  },
  {
    id: 3,
    storeName: '출근하기 싫은 가게 고척점',
    status: 'submitted',
    filterType: 'not_viewed',
    applicationDetail: {
      ...SAMPLE_APPLICATION_DETAIL,
      selectedWeekdays: ['토', '일'],
    },
  },
  {
    id: 4,
    storeName: '출근하기 싫은 가게 고척점',
    status: 'accepted',
    filterType: 'viewed',
    applicationDetail: {
      ...SAMPLE_APPLICATION_DETAIL,
      selectedWeekdays: ['목'],
      selfIntroduction: '성실히 일하겠습니다.',
    },
  },
  {
    id: 5,
    storeName: '집에 가고 싶은 가게 부천점',
    status: 'cancelled',
    filterType: 'cancelled',
    applicationDetail: SAMPLE_APPLICATION_DETAIL,
  },
]

export function AppliedStoresPage() {
  const [stores, setStores] = useState<AppliedStoreData[]>(INITIAL_STORES)
  const [selectedStore, setSelectedStore] = useState<AppliedStoreData | null>(
    null
  )

  const {
    filterLabel,
    isDropdownOpen,
    dropdownRef,
    filterOptions,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
  } = useAppliedStoresViewModel(stores)

  const closeDetail = () => setSelectedStore(null)

  const handleCancelApplication = () => {
    if (!selectedStore) return
    setStores(prev => prev.filter(s => s.id !== selectedStore.id))
    closeDetail()
  }

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
                    index < filterOptions.length - 1
                      ? 'border-b border-line-2'
                      : ''
                  }`}
                  onClick={() => selectFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

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
      </div>

      {selectedStore?.applicationDetail && (
        <AppliedStoreDetailModal
          isOpen
          onClose={closeDetail}
          storeName={selectedStore.storeName}
          detail={selectedStore.applicationDetail}
          showCancelButton={selectedStore.status === 'submitted'}
          onCancel={handleCancelApplication}
        />
      )}
    </div>
  )
}
