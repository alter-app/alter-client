import { forwardRef, useImperativeHandle, useState } from 'react'
import CloseIcon from '@/assets/icons/job-lookup-map/Close.svg?react'
import FilterIcon from '@/assets/icons/job-lookup-map/Filter.svg?react'
import { NearbyModeFilterDrawer } from '@/features/job-lookup-map/common/NearbyModeFilterDrawer'
import { RegionModeFilterDrawer } from '@/features/job-lookup-map/common/RegionModeFilterDrawer'
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

function FilterIconButton({
  activeFilterCount,
  onClick,
}: {
  activeFilterCount: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label="필터 열기"
      onClick={onClick}
      className="relative flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-line-2 bg-white text-text-100"
    >
      <FilterIcon className="size-5" aria-hidden />
      {activeFilterCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-main text-[10px] font-semibold leading-none text-text-100">
          {activeFilterCount}
        </span>
      ) : null}
    </button>
  )
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex h-[34px] items-center gap-1 rounded-full bg-main-100 px-3 typography-body03-semibold text-sub">
      {label}
      <button
        type="button"
        aria-label={`${label} 필터 제거`}
        onClick={onRemove}
        className="flex size-4 items-center justify-center text-sub"
      >
        <CloseIcon className="size-3" aria-hidden />
      </button>
    </span>
  )
}

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
  const [isNearbyFilterDrawerOpen, setIsNearbyFilterDrawerOpen] =
    useState(false)

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
        setIsNearbyFilterDrawerOpen(true)
      },
    }),
    [mode, setIsRegionFilterDrawerOpen]
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
  const sortChipLabel = formatSortChipLabel(sortValue, resolvedSortOptions)
  const salaryChipLabel = formatSalaryChipLabel(salaryFilter)

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
            onClick={() => {
              setIsNearbyFilterDrawerOpen(false)
              onModeChange('region')
            }}
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
            <FilterIconButton
              activeFilterCount={activeFilterCount}
              onClick={() => setIsRegionFilterDrawerOpen(true)}
            />

            {hasRegionFilterApplied(regionSelection) && regionChipLabel ? (
              <ActiveFilterChip
                label={regionChipLabel}
                onRemove={() => onRegionChange?.(EMPTY_REGION_SELECTION)}
              />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <FilterIconButton
              activeFilterCount={activeFilterCount}
              onClick={() => setIsNearbyFilterDrawerOpen(true)}
            />

            {hasSortSelected ? (
              <ActiveFilterChip
                label={sortChipLabel}
                onRemove={() => onSortChange?.(DEFAULT_SORT_VALUE)}
              />
            ) : null}

            {hasSalarySelected ? (
              <ActiveFilterChip
                label={salaryChipLabel}
                onRemove={() => onSalaryChange?.(EMPTY_SALARY_FILTER)}
              />
            ) : null}
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
      <NearbyModeFilterDrawer
        open={isNearbyFilterDrawerOpen}
        onOpenChange={setIsNearbyFilterDrawerOpen}
        value={{ sortValue, salaryFilter }}
        onApply={({ sortValue: nextSort, salaryFilter: nextSalary }) => {
          onSortChange?.(nextSort)
          onSalaryChange?.(nextSalary)
        }}
      />
    </>
  )
})
