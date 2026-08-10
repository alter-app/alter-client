import { FilterChip } from '@/features/job-lookup-map/common/FilterChip'
import { SORT_OPTIONS } from '@/features/job-lookup-map/lib/postingFilters'
import type { SalaryFilterSelection } from '@/features/job-lookup-map/lib/postingFilters'

type SortSalaryFilterSectionsProps = {
  sortDraft: string
  onSortChange: (value: string) => void
  salaryDraft: SalaryFilterSelection
  minInput: string
  maxInput: string
  onSalaryPreset: (preset: 'all' | 'custom') => void
  onMinChange: (raw: string) => void
  onMaxChange: (raw: string) => void
  className?: string
}

export function SortSalaryFilterSections({
  sortDraft,
  onSortChange,
  salaryDraft,
  minInput,
  maxInput,
  onSalaryPreset,
  onMinChange,
  onMaxChange,
  className,
}: SortSalaryFilterSectionsProps) {
  const isCustomSalary = salaryDraft.preset === 'custom'

  return (
    <>
      <section className={className}>
        <h3 className="typography-body01-semibold text-text-100">정렬</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SORT_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={sortDraft === option.value}
              onClick={() => onSortChange(option.value)}
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
            onClick={() => onSalaryPreset('all')}
          />
          <FilterChip
            label="직접 입력"
            selected={isCustomSalary}
            onClick={() => onSalaryPreset('custom')}
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
                  onChange={e => onMinChange(e.target.value)}
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
              <span className="typography-body01-regular text-text-50">~</span>
              <label className="relative flex-1">
                <span className="sr-only">최대 시급</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={maxInput}
                  onChange={e => onMaxChange(e.target.value)}
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
    </>
  )
}
