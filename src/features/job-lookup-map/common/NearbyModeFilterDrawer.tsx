import { useState } from 'react'

import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import {
  DEFAULT_SORT_VALUE,
  EMPTY_SALARY_FILTER,
  formatSalaryInput,
  parseSalaryInput,
  type SalaryFilterSelection,
} from '@/features/job-lookup-map/lib/postingFilters'

const SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'PAY_AMOUNT', label: '급여순' },
] as const

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

function FilterChip({
  selected,
  label,
  onClick,
}: {
  selected: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[34px] items-center rounded-full px-4 transition-colors ${
        selected
          ? 'bg-main typography-body03-semibold text-text-100'
          : 'bg-bg-dark typography-body03-regular text-text-90'
      }`}
    >
      {label}
    </button>
  )
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
  const [sortDraft, setSortDraft] = useState(value.sortValue)
  const [salaryDraft, setSalaryDraft] = useState(value.salaryFilter)
  const [minInput, setMinInput] = useState(
    formatSalaryInput(value.salaryFilter.min)
  )
  const [maxInput, setMaxInput] = useState(
    formatSalaryInput(value.salaryFilter.max)
  )

  const handleSalaryPreset = (preset: 'all' | 'custom') => {
    if (preset === 'all') {
      setSalaryDraft(EMPTY_SALARY_FILTER)
      setMinInput('')
      setMaxInput('')
      return
    }

    setSalaryDraft(prev => ({
      preset: 'custom',
      min: prev.min,
      max: prev.max,
    }))
  }

  const handleMinChange = (raw: string) => {
    const min = parseSalaryInput(raw)
    setMinInput(min != null ? formatSalaryInput(min) : '')
    setSalaryDraft(prev => ({
      preset: 'custom',
      min,
      max: prev.max,
    }))
  }

  const handleMaxChange = (raw: string) => {
    const max = parseSalaryInput(raw)
    setMaxInput(max != null ? formatSalaryInput(max) : '')
    setSalaryDraft(prev => ({
      preset: 'custom',
      min: prev.min,
      max,
    }))
  }

  const handleReset = () => {
    setSortDraft(DEFAULT_SORT_VALUE)
    setSalaryDraft(EMPTY_SALARY_FILTER)
    setMinInput('')
    setMaxInput('')
  }

  const handleApply = () => {
    let nextSalary = salaryDraft
    if (
      salaryDraft.min != null &&
      salaryDraft.max != null &&
      salaryDraft.min > salaryDraft.max
    ) {
      nextSalary = {
        ...salaryDraft,
        min: salaryDraft.max,
        max: salaryDraft.min,
      }
    }

    onApply({
      sortValue: sortDraft,
      salaryFilter: nextSalary,
    })
    onOpenChange(false)
  }

  const isCustomSalary = salaryDraft.preset === 'custom'

  return (
    <>
      <div className="scrollbar-hide max-h-[calc(85dvh-220px)] overflow-y-auto overscroll-contain px-4 pb-4 [-webkit-overflow-scrolling:touch]">
        <section>
          <h3 className="typography-body01-semibold text-text-100">정렬</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SORT_OPTIONS.map(option => (
              <FilterChip
                key={option.value}
                label={option.label}
                selected={sortDraft === option.value}
                onClick={() => setSortDraft(option.value)}
              />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="typography-body01-semibold text-text-100">급여</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label="전체"
              selected={salaryDraft.preset === 'all'}
              onClick={() => handleSalaryPreset('all')}
            />
            <FilterChip
              label="직접 입력"
              selected={isCustomSalary}
              onClick={() => handleSalaryPreset('custom')}
            />
          </div>

          {isCustomSalary ? (
            <div className="mt-4">
              <p className="typography-body02-regular text-text-50">
                최소 / 최대 시급
              </p>
              <div className="mt-2 flex items-center gap-2">
                <label className="relative flex-1">
                  <span className="sr-only">최소 시급</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minInput}
                    onChange={e => handleMinChange(e.target.value)}
                    placeholder="12,000"
                    className={`h-12 w-full rounded-2xl border px-4 pr-10 typography-body01-regular text-text-100 outline-none placeholder:text-text-50 ${
                      salaryDraft.min != null
                        ? 'border-main'
                        : 'border-line-2 focus:border-main'
                    }`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center typography-body01-regular text-text-100">
                    원
                  </span>
                </label>
                <span className="typography-body01-regular text-text-50">
                  ~
                </span>
                <label className="relative flex-1">
                  <span className="sr-only">최대 시급</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxInput}
                    onChange={e => handleMaxChange(e.target.value)}
                    placeholder="최대"
                    className={`h-12 w-full rounded-2xl border px-4 pr-10 typography-body01-regular text-text-100 outline-none placeholder:text-text-50 ${
                      salaryDraft.max != null
                        ? 'border-main'
                        : 'border-line-2 focus:border-main'
                    }`}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center typography-body01-regular text-text-100">
                    원
                  </span>
                </label>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <FilterDrawerApplyFooter
        showReset
        applyLabel="적용"
        onReset={handleReset}
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
