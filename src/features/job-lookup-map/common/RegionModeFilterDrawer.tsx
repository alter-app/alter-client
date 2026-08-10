import { useMemo, useState } from 'react'

import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon'
import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import { useAddresses } from '@/features/job-lookup-map/hooks/useAddresses'
import {
  DEFAULT_SORT_VALUE,
  EMPTY_SALARY_FILTER,
  formatSalaryInput,
  parseSalaryInput,
  type SalaryFilterSelection,
} from '@/features/job-lookup-map/lib/postingFilters'
import {
  EMPTY_REGION_SELECTION,
  REGION_STEPS,
  getRegionOptionsForStep,
  type RegionOption,
  type RegionSelection,
  type RegionStep,
} from '@/features/job-lookup-map/lib/regionOptions'

const SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'PAY_AMOUNT', label: '급여순' },
] as const

type RegionModeFilterValues = {
  regionSelection: RegionSelection
  sortValue: string
  salaryFilter: SalaryFilterSelection
}

type RegionModeFilterDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: RegionModeFilterValues
  onApply: (values: RegionModeFilterValues) => void
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

function getStepLabel(step: RegionStep, draft: RegionSelection): string {
  if (step === 'sido') {
    return draft.sido && draft.sido !== '전국(전체)' ? draft.sido : '시/도'
  }
  if (step === 'sigungu') {
    return draft.sigungu && draft.sigungu !== '전체'
      ? draft.sigungu
      : '시/군/구'
  }
  return draft.dong && draft.dong !== '전체' ? draft.dong : '읍/면/동'
}

function RegionModeFilterDrawerBody({
  value,
  onOpenChange,
  onApply,
}: {
  value: RegionModeFilterValues
  onOpenChange: (open: boolean) => void
  onApply: (values: RegionModeFilterValues) => void
}) {
  const [regionDraft, setRegionDraft] = useState<RegionSelection>(
    value.regionSelection
  )
  const [sortDraft, setSortDraft] = useState(value.sortValue)
  const [salaryDraft, setSalaryDraft] = useState(value.salaryFilter)
  const [minInput, setMinInput] = useState(
    formatSalaryInput(value.salaryFilter.min)
  )
  const [maxInput, setMaxInput] = useState(
    formatSalaryInput(value.salaryFilter.max)
  )
  const [regionStep, setRegionStep] = useState<RegionStep>('sido')

  const parentCode =
    regionStep === 'sigungu'
      ? (regionDraft.sidoCode ?? undefined)
      : regionStep === 'dong'
        ? (regionDraft.sigunguCode ?? undefined)
        : undefined

  const addressesEnabled =
    regionStep === 'sido' ||
    (regionStep === 'sigungu' && regionDraft.sidoCode != null) ||
    (regionStep === 'dong' && regionDraft.sigunguCode != null)

  const { addresses, isLoading, isError } = useAddresses(
    parentCode,
    addressesEnabled
  )

  const regionOptions = useMemo(
    () => getRegionOptionsForStep(regionStep, addresses),
    [regionStep, addresses]
  )

  const selectedForStep =
    regionStep === 'sido'
      ? regionDraft.sido
      : regionStep === 'sigungu'
        ? regionDraft.sigungu
        : regionDraft.dong

  const canGoToStep = (target: RegionStep) => {
    if (target === 'sido') return true
    if (target === 'sigungu') {
      return regionDraft.sido != null && regionDraft.sido !== '전국(전체)'
    }
    return (
      regionDraft.sido != null &&
      regionDraft.sido !== '전국(전체)' &&
      regionDraft.sigungu != null &&
      regionDraft.sigungu !== '전체'
    )
  }

  const handleRegionSelect = (option: RegionOption) => {
    if (regionStep === 'sido') {
      if (option.name === '전국(전체)') {
        setRegionDraft({
          ...EMPTY_REGION_SELECTION,
          sido: '전국(전체)',
          sigungu: '전체',
          dong: '전체',
        })
        return
      }

      setRegionDraft({
        sido: option.name,
        sidoCode: option.code,
        sigungu: null,
        sigunguCode: null,
        dong: null,
        dongCode: null,
      })
      setRegionStep('sigungu')
      return
    }

    if (regionStep === 'sigungu') {
      if (option.name === '전체') {
        setRegionDraft({
          ...regionDraft,
          sigungu: '전체',
          sigunguCode: null,
          dong: '전체',
          dongCode: null,
        })
        return
      }

      setRegionDraft({
        ...regionDraft,
        sigungu: option.name,
        sigunguCode: option.code,
        dong: null,
        dongCode: null,
      })
      setRegionStep('dong')
      return
    }

    if (option.name === '전체') {
      setRegionDraft({
        ...regionDraft,
        dong: '전체',
        dongCode: null,
      })
      return
    }

    setRegionDraft({
      ...regionDraft,
      dong: option.name,
      dongCode: option.code,
    })
  }

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
    setRegionDraft(EMPTY_REGION_SELECTION)
    setRegionStep('sido')
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
      regionSelection: regionDraft,
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
          <h3 className="typography-body01-semibold text-text-100">지역</h3>

          <div className="mt-3 flex items-end gap-1 border-b border-line-1">
            {REGION_STEPS.map((item, index) => {
              const active = regionStep === item.key
              const enabled = canGoToStep(item.key)
              return (
                <div key={item.key} className="flex items-center gap-1">
                  {index > 0 ? (
                    <ChevronRightIcon
                      width={12}
                      height={12}
                      className="mb-3 text-text-50"
                    />
                  ) : null}
                  <button
                    type="button"
                    disabled={!enabled}
                    onClick={() => enabled && setRegionStep(item.key)}
                    className={`max-w-[88px] truncate pb-3 typography-body02-semibold transition-colors ${
                      active
                        ? 'border-b-2 border-main text-main'
                        : enabled
                          ? 'border-b-2 border-transparent text-text-50'
                          : 'border-b-2 border-transparent text-text-50 opacity-50'
                    }`}
                  >
                    {getStepLabel(item.key, regionDraft)}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {isLoading ? (
              <p className="py-2 typography-body02-regular text-text-50">
                지역 정보를 불러오는 중…
              </p>
            ) : isError ? (
              <p className="py-2 typography-body02-regular text-text-50">
                지역 정보를 불러오지 못했습니다.
              </p>
            ) : (
              regionOptions.map(option => (
                <FilterChip
                  key={option.code ?? option.name}
                  label={option.name}
                  selected={selectedForStep === option.name}
                  onClick={() => handleRegionSelect(option)}
                />
              ))
            )}
          </div>
        </section>

        <section className="mt-6">
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

export function RegionModeFilterDrawer({
  open,
  onOpenChange,
  value,
  onApply,
}: RegionModeFilterDrawerProps) {
  const resetKey = `${value.regionSelection.sido ?? ''}-${value.regionSelection.sigungu ?? ''}-${value.regionSelection.dong ?? ''}-${value.sortValue}-${value.salaryFilter.preset}-${value.salaryFilter.min ?? ''}-${value.salaryFilter.max ?? ''}`

  return (
    <FilterDrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title="필터"
      footer={null}
    >
      {open ? (
        <RegionModeFilterDrawerBody
          key={resetKey}
          value={value}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      ) : null}
    </FilterDrawerShell>
  )
}
