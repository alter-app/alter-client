import { useMemo, useState } from 'react'

import { ChevronRightIcon } from '@/assets/icons/ChevronRightIcon'
import { FilterChip } from '@/features/job-lookup-map/common/FilterChip'
import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import { SortSalaryFilterSections } from '@/features/job-lookup-map/common/SortSalaryFilterSections'
import { useAddresses } from '@/features/job-lookup-map/hooks/useAddresses'
import { useSortSalaryFilterDraft } from '@/features/job-lookup-map/hooks/useSortSalaryFilterDraft'
import type { SalaryFilterSelection } from '@/features/job-lookup-map/lib/postingFilters'
import {
  EMPTY_REGION_SELECTION,
  REGION_STEPS,
  getRegionOptionsForStep,
  type RegionOption,
  type RegionSelection,
  type RegionStep,
} from '@/features/job-lookup-map/lib/regionOptions'

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
  const [regionStep, setRegionStep] = useState<RegionStep>('sido')
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

  const handleReset = () => {
    setRegionDraft(EMPTY_REGION_SELECTION)
    setRegionStep('sido')
    resetSortSalary()
  }

  const handleApply = () => {
    onApply({
      regionSelection: regionDraft,
      sortValue: sortDraft,
      salaryFilter: getNormalizedSalary(),
    })
    onOpenChange(false)
  }

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

        <SortSalaryFilterSections
          className="mt-6"
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
