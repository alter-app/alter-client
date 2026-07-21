import { useState } from 'react'

import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import {
  EMPTY_SALARY_FILTER,
  SALARY_PRESETS,
  formatSalaryInput,
  parseSalaryInput,
  type SalaryFilterSelection,
  type SalaryPreset,
} from '@/features/job-lookup-map/lib/postingFilters'

type SalarySelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: SalaryFilterSelection
  onApply: (selection: SalaryFilterSelection) => void
}

function SalarySelectDrawerBody({
  value,
  onOpenChange,
  onApply,
}: {
  value: SalaryFilterSelection
  onOpenChange: (open: boolean) => void
  onApply: (selection: SalaryFilterSelection) => void
}) {
  const [draft, setDraft] = useState(value)
  const [minInput, setMinInput] = useState(formatSalaryInput(value.min))
  const [maxInput, setMaxInput] = useState(formatSalaryInput(value.max))

  const handlePresetSelect = (preset: SalaryPreset, min: number | null) => {
    setDraft({ preset, min, max: null })
    setMinInput(formatSalaryInput(min))
    setMaxInput('')
  }

  const handleMinChange = (raw: string) => {
    const min = parseSalaryInput(raw)
    setMinInput(min != null ? formatSalaryInput(min) : '')
    setDraft(prev => ({
      preset: 'custom',
      min,
      max: prev.max,
    }))
  }

  const handleMaxChange = (raw: string) => {
    const max = parseSalaryInput(raw)
    setMaxInput(max != null ? formatSalaryInput(max) : '')
    setDraft(prev => ({
      preset: 'custom',
      min: prev.min,
      max,
    }))
  }

  const handleReset = () => {
    setDraft(EMPTY_SALARY_FILTER)
    setMinInput('')
    setMaxInput('')
  }

  const handleApply = () => {
    if (draft.min != null && draft.max != null && draft.min > draft.max) {
      onApply({ ...draft, min: draft.max, max: draft.min })
      onOpenChange(false)
      return
    }
    onApply(draft)
    onOpenChange(false)
  }

  return (
    <>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {SALARY_PRESETS.map(({ preset, label, min }) => {
            const selected = draft.preset === preset
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset, min)}
                className={`inline-flex h-[26px] items-center rounded-full px-3 transition-colors ${
                  selected
                    ? 'bg-main typography-body03-semibold text-text-100'
                    : 'border border-line-2 bg-white typography-body03-regular text-text-90'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <p className="mt-5 typography-body02-regular text-text-50">
          직접 입력 (min / max)
        </p>

        <div className="mt-2 flex items-center gap-2">
          <label className="relative flex-1">
            <span className="sr-only">최소 급여</span>
            <input
              type="text"
              inputMode="numeric"
              value={minInput}
              onChange={e => handleMinChange(e.target.value)}
              placeholder="최소"
              className={`h-12 w-full rounded-2xl border px-4 pr-10 typography-body01-regular text-text-100 outline-none placeholder:text-text-50 ${
                draft.min != null
                  ? 'border-main'
                  : 'border-line-2 focus:border-main'
              }`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center typography-body01-regular text-text-100">
              원
            </span>
          </label>
          <span className="typography-body01-regular text-text-50">~</span>
          <label className="relative flex-1">
            <span className="sr-only">최대 급여</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxInput}
              onChange={e => handleMaxChange(e.target.value)}
              placeholder="최대"
              className={`h-12 w-full rounded-2xl border px-4 pr-10 typography-body01-regular text-text-100 outline-none placeholder:text-text-50 ${
                draft.max != null
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

      <FilterDrawerApplyFooter
        showReset
        onReset={handleReset}
        onApply={handleApply}
      />
    </>
  )
}

export function SalarySelectDrawer({
  open,
  onOpenChange,
  value = EMPTY_SALARY_FILTER,
  onApply,
}: SalarySelectDrawerProps) {
  return (
    <FilterDrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title="급여"
      footer={null}
    >
      {open ? (
        <SalarySelectDrawerBody
          key={`${value.preset}-${value.min ?? ''}-${value.max ?? ''}`}
          value={value}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      ) : null}
    </FilterDrawerShell>
  )
}
