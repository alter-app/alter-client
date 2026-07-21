import { useState } from 'react'

import {
  FilterDrawerApplyFooter,
  FilterDrawerShell,
  RadioIndicator,
} from '@/features/job-lookup-map/common/FilterDrawerShell'
import { usePostingFilterOptions } from '@/features/job-lookup-map/hooks/usePostingFilterOptions'
import {
  DEFAULT_SORT_VALUE,
  formatSortOptionLabel,
} from '@/features/job-lookup-map/lib/postingFilters'

const FALLBACK_SORT_OPTIONS = [
  { value: 'LATEST', description: '최신순' },
  { value: 'PAY_AMOUNT', description: '급여순' },
] as const

type SortSelectDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: string
  onApply: (value: string) => void
}

function SortSelectDrawerBody({
  value,
  onOpenChange,
  onApply,
}: {
  value: string
  onOpenChange: (open: boolean) => void
  onApply: (value: string) => void
}) {
  const { sortOptions, isLoading, isError } = usePostingFilterOptions()
  const options =
    sortOptions.length > 0 ? sortOptions : [...FALLBACK_SORT_OPTIONS]
  const [draft, setDraft] = useState(value)

  const handleApply = () => {
    onApply(draft)
    onOpenChange(false)
  }

  return (
    <>
      <div className="px-4 pb-2">
        {isLoading ? (
          <p className="py-8 text-center typography-body02-regular text-text-50">
            정렬 옵션을 불러오는 중…
          </p>
        ) : isError ? (
          <p className="py-8 text-center typography-body02-regular text-text-50">
            정렬 옵션을 불러오지 못했습니다.
          </p>
        ) : (
          <ul>
            {options.map(option => {
              const selected = draft === option.value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => setDraft(option.value)}
                    className="flex h-14 w-full items-center justify-between text-left"
                  >
                    <span
                      className={`typography-body01-regular ${
                        selected
                          ? 'typography-body01-semibold text-main'
                          : 'text-text-100'
                      }`}
                    >
                      {formatSortOptionLabel(option)}
                    </span>
                    <RadioIndicator selected={selected} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <FilterDrawerApplyFooter onApply={handleApply} />
    </>
  )
}

export function SortSelectDrawer({
  open,
  onOpenChange,
  value = DEFAULT_SORT_VALUE,
  onApply,
}: SortSelectDrawerProps) {
  return (
    <FilterDrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title="정렬"
      footer={null}
    >
      {open ? (
        <SortSelectDrawerBody
          key={value}
          value={value}
          onOpenChange={onOpenChange}
          onApply={onApply}
        />
      ) : null}
    </FilterDrawerShell>
  )
}
