import ChevrondownIcon from '@/assets/icons/job-lookup-map/Chevrondown.svg?react'

export type AlbaFindMode = 'nearby' | 'region'

export type AlbaFindFilterId = 'sort' | 'distance' | 'salary'

type AlbaFindCategoryBarProps = {
  mode: AlbaFindMode
  onModeChange: (mode: AlbaFindMode) => void
  activeFilter: AlbaFindFilterId
  onFilterChange: (id: AlbaFindFilterId) => void
}

const NEARBY_FILTER_ITEMS: { id: AlbaFindFilterId; label: string }[] = [
  { id: 'sort', label: '최신순' },
  { id: 'distance', label: '거리' },
  { id: 'salary', label: '급여' },
]

const REGION_FILTER_ITEMS: { id: AlbaFindFilterId; label: string }[] = [
  { id: 'sort', label: '최신순' },
  { id: 'distance', label: '서울' },
  { id: 'salary', label: '전체' },
]

function getFilterItems(mode: AlbaFindMode) {
  return mode === 'region' ? REGION_FILTER_ITEMS : NEARBY_FILTER_ITEMS
}

export function AlbaFindCategoryBar({
  mode,
  onModeChange,
  activeFilter,
  onFilterChange,
}: AlbaFindCategoryBarProps) {
  const filterItems = getFilterItems(mode)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 gap-1 rounded-lg bg-bg-dark p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'nearby'}
          onClick={() => onModeChange('nearby')}
          className={`min-h-10 flex-1 rounded-lg typography-body01-semibold transition-colors ${
            mode === 'nearby'
              ? 'border border-line-2 bg-white text-text-100 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)]'
              : 'bg-transparent text-text-50'
          }`}
        >
          주변에서 찾기
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'region'}
          onClick={() => onModeChange('region')}
          className={`min-h-10 flex-1 rounded-lg typography-body01-semibold transition-colors ${
            mode === 'region'
              ? 'border border-line-2 bg-white text-text-100 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.12)]'
              : 'bg-transparent text-text-50'
          }`}
        >
          지역에서 찾기
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterItems.map(({ id, label }, index) => {
          const active = activeFilter === id
          const showChevron = mode === 'nearby' || id === 'sort'
          return (
            <div key={id} className="flex items-center gap-2">
              {index === 1 ? (
                <div className="h-[26px] w-px shrink-0 bg-line-2" aria-hidden />
              ) : null}
              <button
                type="button"
                onClick={() => onFilterChange(id)}
                className={`inline-flex h-[26px] min-w-0 items-center gap-1 rounded-full px-3 transition-colors ${
                  active
                    ? 'bg-main typography-body03-semibold text-text-100'
                    : 'border border-line-2 bg-white typography-body03-regular text-text-90'
                }`}
              >
                <span>{label}</span>
                {showChevron ? (
                  <ChevrondownIcon
                    className={active ? 'text-text-100' : 'text-text-70'}
                  />
                ) : null}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
