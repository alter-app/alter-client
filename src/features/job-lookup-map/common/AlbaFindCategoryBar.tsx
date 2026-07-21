import { useState } from 'react'
import ChevrondownIcon from '@/assets/icons/job-lookup-map/Chevrondown.svg?react'
import { RegionSelectDrawer } from '@/features/job-lookup-map/common/RegionSelectDrawer'
import { SalarySelectDrawer } from '@/features/job-lookup-map/common/SalarySelectDrawer'
import { SortSelectDrawer } from '@/features/job-lookup-map/common/SortSelectDrawer'
import { usePostingFilterOptions } from '@/features/job-lookup-map/hooks/usePostingFilterOptions'
import {
  DEFAULT_SORT_VALUE,
  EMPTY_SALARY_FILTER,
  formatSalaryChipLabel,
  formatSortChipLabel,
  isSalaryFilterApplied,
  isSortFilterApplied,
  type SalaryFilterSelection,
} from '@/features/job-lookup-map/lib/postingFilters'
import {
  EMPTY_REGION_SELECTION,
  formatRegionLabel,
  type RegionSelection,
} from '@/features/job-lookup-map/lib/regionOptions'

export type AlbaFindMode = 'nearby' | 'region'

export type AlbaFindFilterId = 'sort' | 'distance' | 'salary'

type AlbaFindCategoryBarProps = {
  mode: AlbaFindMode
  onModeChange: (mode: AlbaFindMode) => void
  regionSelection?: RegionSelection
  onRegionChange?: (selection: RegionSelection) => void
  sortValue?: string
  onSortChange?: (value: string) => void
  salaryFilter?: SalaryFilterSelection
  onSalaryChange?: (selection: SalaryFilterSelection) => void
}

const FILTER_ITEMS: { id: AlbaFindFilterId; label: string }[] = [
  { id: 'sort', label: '지역 선택' },
  { id: 'distance', label: '최신순' },
  { id: 'salary', label: '전체' },
]

const FALLBACK_SORT_OPTIONS = [
  { value: 'LATEST', description: '최신순' },
  { value: 'PAY_AMOUNT', description: '급여순' },
]

function getFilterItems(
  regionSelection: RegionSelection,
  sortValue: string,
  sortOptions: { value: string; description: string }[],
  salaryFilter: SalaryFilterSelection
) {
  return FILTER_ITEMS.map(item => {
    if (item.id === 'sort') {
      return { ...item, label: formatRegionLabel(regionSelection) }
    }
    if (item.id === 'distance') {
      return {
        ...item,
        label: formatSortChipLabel(sortValue, sortOptions),
      }
    }
    return { ...item, label: formatSalaryChipLabel(salaryFilter) }
  })
}

export function AlbaFindCategoryBar({
  mode,
  onModeChange,
  regionSelection = EMPTY_REGION_SELECTION,
  onRegionChange,
  sortValue = DEFAULT_SORT_VALUE,
  onSortChange,
  salaryFilter = EMPTY_SALARY_FILTER,
  onSalaryChange,
}: AlbaFindCategoryBarProps) {
  const { sortOptions } = usePostingFilterOptions()
  const resolvedSortOptions =
    sortOptions.length > 0 ? sortOptions : FALLBACK_SORT_OPTIONS

  const [isRegionDrawerOpen, setIsRegionDrawerOpen] = useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const [isSalaryDrawerOpen, setIsSalaryDrawerOpen] = useState(false)

  const filterItems = getFilterItems(
    regionSelection,
    sortValue,
    resolvedSortOptions,
    salaryFilter
  )
  const regionLabel = formatRegionLabel(regionSelection)
  const hasRegionSelected = regionLabel !== '지역 선택'
  const hasSortSelected = isSortFilterApplied(sortValue)
  const hasSalarySelected = isSalaryFilterApplied(salaryFilter)

  const handleFilterClick = (id: AlbaFindFilterId) => {
    if (id === 'sort') {
      setIsRegionDrawerOpen(true)
      return
    }
    if (id === 'distance') {
      setIsSortDrawerOpen(true)
      return
    }
    if (id === 'salary') {
      setIsSalaryDrawerOpen(true)
      return
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div
          className="flex h-12 gap-1 rounded-lg bg-bg-dark p-1"
          role="tablist"
        >
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
            const active =
              id === 'sort'
                ? hasRegionSelected
                : id === 'distance'
                  ? hasSortSelected
                  : hasSalarySelected
            return (
              <div key={id} className="flex items-center gap-2">
                {index === 1 ? (
                  <div
                    className="h-[26px] w-px shrink-0 bg-line-2"
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => handleFilterClick(id)}
                  className={`inline-flex h-[26px] min-w-0 items-center gap-1 rounded-full px-3 transition-colors ${
                    active
                      ? 'bg-main typography-body03-semibold text-text-100'
                      : 'border border-line-2 bg-white typography-body03-regular text-text-90'
                  }`}
                >
                  <span>{label}</span>
                  <ChevrondownIcon
                    className={active ? 'text-text-100' : 'text-text-70'}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <RegionSelectDrawer
        open={isRegionDrawerOpen}
        onOpenChange={setIsRegionDrawerOpen}
        value={regionSelection}
        onApply={selection => onRegionChange?.(selection)}
      />
      <SortSelectDrawer
        open={isSortDrawerOpen}
        onOpenChange={setIsSortDrawerOpen}
        value={sortValue}
        onApply={value => onSortChange?.(value)}
      />
      <SalarySelectDrawer
        open={isSalaryDrawerOpen}
        onOpenChange={setIsSalaryDrawerOpen}
        value={salaryFilter}
        onApply={selection => onSalaryChange?.(selection)}
      />
    </>
  )
}
