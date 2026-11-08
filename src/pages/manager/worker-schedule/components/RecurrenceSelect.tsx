import { Fragment } from 'react'
import type { FixedScheduleRecurrenceType } from '@/features/manager'
import { cn } from '@/shared/lib/utils'

const RECURRENCE_OPTIONS: {
  value: FixedScheduleRecurrenceType
  label: string
}[] = [
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
]

interface RecurrenceSelectProps {
  value: FixedScheduleRecurrenceType
  onChange: (value: FixedScheduleRecurrenceType) => void
}

export function RecurrenceSelect({ value, onChange }: RecurrenceSelectProps) {
  return (
    <div
      className="flex items-center typography-body02-semibold"
      role="group"
      aria-label="반복 주기"
    >
      {RECURRENCE_OPTIONS.map((option, index) => (
        <Fragment key={option.value}>
          {index > 0 ? (
            <span className="mx-1 text-text-50" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'transition-colors',
              value === option.value ? 'text-text-90' : 'text-text-50',
              value === option.value
                ? 'typography-body02-semibold'
                : 'typography-body02-regular'
            )}
          >
            {option.label}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
