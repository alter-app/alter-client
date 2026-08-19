import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import { SortSalaryFilterSections } from '@/features/job-lookup-map/common/SortSalaryFilterSections'
import { useSortSalaryFilterDraft } from '@/features/job-lookup-map/hooks/useSortSalaryFilterDraft'
import type { SalaryFilterSelection } from '@/features/job-lookup-map/lib/postingFilters'

type NearbyModeFilterValues = {
  sortValue: string
  salaryFilter: SalaryFilterSelection
}

type NearbyModeFilterDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: NearbyModeFilterValues
  onApply: (values: NearbyModeFilterValues) => void
}

function NearbyModeFilterDrawerBody({
  value,
  onOpenChange,
  onApply,
}: {
  value: NearbyModeFilterValues
  onOpenChange: (open: boolean) => void
  onApply: (values: NearbyModeFilterValues) => void
}) {
  const {
    sortDraft,
    setSortDraft,
    salaryDraft,
    minInput,
    maxInput,
    handleSalaryPreset,
    handleMinChange,
    handleMaxChange,
    resetSortSalary,
    getNormalizedSalary,
  } = useSortSalaryFilterDraft(value)

  const handleApply = () => {
    onApply({
      sortValue: sortDraft,
      salaryFilter: getNormalizedSalary(),
    })
    onOpenChange(false)
  }

  return (
    <>
      <div className="scrollbar-hide max-h-[calc(85dvh-220px)] overflow-y-auto overscroll-contain px-4 pb-4 [-webkit-overflow-scrolling:touch]">
        <SortSalaryFilterSections
          sortDraft={sortDraft}
          onSortChange={setSortDraft}
          salaryDraft={salaryDraft}
          minInput={minInput}
          maxInput={maxInput}
          onSalaryPreset={handleSalaryPreset}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
        />
      </div>

      <FilterDrawerApplyFooter
        showReset
        applyLabel="적용"
        onReset={resetSortSalary}
        onApply={handleApply}
      />
    </>
  )
}

export function NearbyModeFilterDrawer({
  open,
  onOpenChange,
  value,
  onApply,
}: NearbyModeFilterDrawerProps) {
  const resetKey = `${value.sortValue}-${value.salaryFilter.preset}-${value.salaryFilter.min ?? ''}-${value.salaryFilter.max ?? ''}`

  return (
    <FilterDrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title="필터"
      footer={null}
    >
      {open ? (
        <NearbyModeFilterDrawerBody
          key={resetKey}
          value={value}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      ) : null}
    </FilterDrawerShell>
  )
}
