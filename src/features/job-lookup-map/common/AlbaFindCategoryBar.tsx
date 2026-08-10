import { forwardRef, useImperativeHandle, useState } from 'react'
import ChevrondownIcon from '@/assets/icons/job-lookup-map/Chevrondown.svg?react'
import CloseIcon from '@/assets/icons/job-lookup-map/Close.svg?react'
import FilterIcon from '@/assets/icons/job-lookup-map/Filter.svg?react'
import { RegionModeFilterDrawer } from '@/features/job-lookup-map/common/RegionModeFilterDrawer'
import { SalarySelectDrawer } from '@/features/job-lookup-map/common/SalarySelectDrawer'
import { SortSelectDrawer } from '@/features/job-lookup-map/common/SortSelectDrawer'
import {
  DEFAULT_SORT_VALUE,
  EMPTY_SALARY_FILTER,
  countActiveFilters,
  formatSalaryChipLabel,
  formatSortChipLabel,
  isSalaryFilterApplied,
  isSortFilterApplied,
  type SalaryFilterSelection,
} from '@/features/job-lookup-map/lib/postingFilters'
import {
  EMPTY_REGION_SELECTION,
  formatRegionChipLabel,
  hasRegionFilterApplied,
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
  regionFilterDrawerOpen?: boolean
  onRegionFilterDrawerOpenChange?: (open: boolean) => void
}

export type AlbaFindCategoryBarRef = {
  openFilters: () => void
}

const FALLBACK_SORT_OPTIONS = [
  { value: 'LATEST', description: '최신순' },
  { value: 'PAY_AMOUNT', description: '급여순' },
]

export const AlbaFindCategoryBar = forwardRef<
  AlbaFindCategoryBarRef,
  AlbaFindCategoryBarProps
>(function AlbaFindCategoryBar(
  {
    mode,
    onModeChange,
    regionSelection = EMPTY_REGION_SELECTION,
    onRegionChange,
    sortValue = DEFAULT_SORT_VALUE,
    onSortChange,
    salaryFilter = EMPTY_SALARY_FILTER,
    onSalaryChange,
    regionFilterDrawerOpen,
    onRegionFilterDrawerOpenChange,
  },
  ref
) {
  const resolvedSortOptions = FALLBACK_SORT_OPTIONS

  const [internalRegionFilterDrawerOpen, setInternalRegionFilterDrawerOpen] =
    useState(false)
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false)
  const [isSalaryDrawerOpen, setIsSalaryDrawerOpen] = useState(false)

  const isRegionFilterDrawerOpen =
    regionFilterDrawerOpen ?? internalRegionFilterDrawerOpen
  const setIsRegionFilterDrawerOpen =
    onRegionFilterDrawerOpenChange ?? setInternalRegionFilterDrawerOpen

  useImperativeHandle(
    ref,
    () => ({
      openFilters: () => {
        if (mode === 'region') {
          setIsRegionFilterDrawerOpen(true)
          return
        }
        if (isSalaryFilterApplied(salaryFilter)) {
          setIsSalaryDrawerOpen(true)
          return
        }
        setIsSortDrawerOpen(true)
      },
    }),
    [mode, salaryFilter, setIsRegionFilterDrawerOpen]
  )

  const activeFilterCount = countActiveFilters({
    mode,
    regionSelection,
    sortValue,
    salaryFilter,
  })
  const regionChipLabel = formatRegionChipLabel(regionSelection)
  const hasSortSelected = isSortFilterApplied(sortValue)
  const hasSalarySelected = isSalaryFilterApplied(salaryFilter)

  const nearbyFilterItems = [
    {
      id: 'distance' as const,
      label: formatSortChipLabel(sortValue, resolvedSortOptions),
      active: hasSortSelected,
    },
    {
      id: 'salary' as const,
      label: formatSalaryChipLabel(salaryFilter),
      active: hasSalarySelected,
    },
  ]

  const handleNearbyFilterClick = (id: AlbaFindFilterId) => {
    if (id === 'distance') {
      setIsSortDrawerOpen(true)
      return
    }
    if (id === 'salary') {
      setIsSalaryDrawerOpen(true)
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
            onClick={() => {
              setIsRegionFilterDrawerOpen(false)
              onModeChange('nearby')
            }}
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

        {mode === 'region' ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="필터 열기"
              onClick={() => setIsRegionFilterDrawerOpen(true)}
              className="relative flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-line-2 bg-white text-text-100"
            >
              <FilterIcon className="size-5" aria-hidden />
              {activeFilterCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-main text-[10px] font-semibold leading-none text-text-100">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            {hasRegionFilterApplied(regionSelection) && regionChipLabel ? (
              <span className="inline-flex h-[34px] items-center gap-1 rounded-full bg-main-100 px-3 typography-body03-semibold text-sub">
                {regionChipLabel}
                <button
                  type="button"
                  aria-label={`${regionChipLabel} 필터 제거`}
                  onClick={() => onRegionChange?.(EMPTY_REGION_SELECTION)}
                  className="flex size-4 items-center justify-center text-sub"
                >
                  <CloseIcon className="size-3" aria-hidden />
                </button>
              </span>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {nearbyFilterItems.map(({ id, label, active }, index) => (
              <div key={id} className="flex items-center gap-2">
                {index === 1 ? (
                  <div
                    className="h-[26px] w-px shrink-0 bg-line-2"
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => handleNearbyFilterClick(id)}
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
            ))}
          </div>
        )}
      </div>

      <RegionModeFilterDrawer
        open={isRegionFilterDrawerOpen}
        onOpenChange={setIsRegionFilterDrawerOpen}
        value={{ regionSelection, sortValue, salaryFilter }}
        onApply={({
          regionSelection: nextRegion,
          sortValue: nextSort,
          salaryFilter: nextSalary,
        }) => {
          onRegionChange?.(nextRegion)
          onSortChange?.(nextSort)
          onSalaryChange?.(nextSalary)
        }}
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
})
