import { Navbar } from '@/shared/ui/common/Navbar'
import { AppliedStoreListItem } from '@/features/home/user/ui/AppliedStoreListItem'
import { useAppliedStoresViewModel } from '@/features/home/user/hooks/useAppliedStoresViewModel'
import type { AppliedStoreData } from '@/features/home/user/types/appliedStore'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'

const DUMMY_STORES: AppliedStoreData[] = [
  {
    id: 1,
    storeName: '출근하기 싫은 가게 부천점',
    status: 'submitted',
    filterType: 'completed',
  },
  {
    id: 2,
    storeName: '집에 가고 싶은 가게 부천점',
    status: 'submitted',
    filterType: 'completed',
  },
  {
    id: 3,
    storeName: '출근하기 싫은 가게 고척점',
    status: 'submitted',
    filterType: 'not_viewed',
  },
  {
    id: 4,
    storeName: '출근하기 싫은 가게 고척점',
    status: 'accepted',
    filterType: 'viewed',
  },
  {
    id: 5,
    storeName: '집에 가고 싶은 가게 부천점',
    status: 'cancelled',
    filterType: 'cancelled',
  },
]

export function AppliedStoresPage() {
  const {
    filterLabel,
    isDropdownOpen,
    dropdownRef,
    filterOptions,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
  } = useAppliedStoresViewModel(DUMMY_STORES)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="내가 지원한 가게" />
      <div className="w-full max-w-[390px] mx-auto px-4 py-4">
        <div className="relative flex justify-end mb-2" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center gap-2 typography-body02-regular text-text-90"
            onClick={toggleDropdown}
          >
            {filterLabel}
            <DownIcon className="size-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-[98px] rounded-2xl bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] overflow-hidden z-10">
              {filterOptions.map((option, index) => (
                <button
                  key={option.key}
                  type="button"
                  className={`flex w-full items-center h-10 px-4 typography-body02-regular text-text-100 ${
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
              <h2 className="typography-headline01 text-text-100 mb-4">
                {section.label}
              </h2>
              <div className="flex flex-col gap-2">
                {section.stores.map(store => (
                  <AppliedStoreListItem
                    key={store.id}
                    storeName={store.storeName}
                    status={getCardStatus(store.status)}
                    thumbnailUrl={store.thumbnailUrl}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
