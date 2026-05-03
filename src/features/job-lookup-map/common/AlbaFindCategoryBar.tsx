export type AlbaFindMode = 'nearby' | 'region'

export type AlbaFindFilterId = 'sort' | 'distance' | 'salary'

type AlbaFindCategoryBarProps = {
  mode: AlbaFindMode
  onModeChange: (mode: AlbaFindMode) => void
  activeFilter: AlbaFindFilterId
  onFilterChange: (id: AlbaFindFilterId) => void
}

const FILTER_ITEMS: { id: AlbaFindFilterId; label: string }[] = [
  { id: 'sort', label: '최신순' },
  { id: 'distance', label: '거리' },
  { id: 'salary', label: '급여' },
]

export function AlbaFindCategoryBar({
  mode,
  onModeChange,
  activeFilter,
  onFilterChange,
}: AlbaFindCategoryBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-xl bg-bg-dark p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'nearby'}
          onClick={() => onModeChange('nearby')}
          className={`min-h-11 flex-1 rounded-lg typography-body02-semibold transition-colors ${
            mode === 'nearby'
              ? 'border border-line-2 bg-white text-text-100 shadow-sm'
              : 'bg-transparent text-text-70'
          }`}
        >
          주변에서 찾기
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'region'}
          onClick={() => onModeChange('region')}
          className={`min-h-11 flex-1 rounded-lg typography-body02-semibold transition-colors ${
            mode === 'region'
              ? 'border border-line-2 bg-white text-text-100 shadow-sm'
              : 'bg-transparent text-text-70'
          }`}
        >
          지역에서 찾기
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_ITEMS.map(({ id, label }) => {
          const active = activeFilter === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              className={`inline-flex h-9 min-w-0 items-center gap-1 rounded-full px-3 typography-body03-semibold transition-colors ${
                active
                  ? 'bg-main text-white'
                  : 'border border-line-2 bg-white text-text-70'
              }`}
            >
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
