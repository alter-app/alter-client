import { Fragment } from 'react'
import { cn } from '@/shared/lib/utils'

export type ScheduleRecurrence = '매주' | '매월'

const RECURRENCE_OPTIONS: ScheduleRecurrence[] = ['매주', '매월']

interface RecurrenceSelectProps {
  value: ScheduleRecurrence
  onChange: (value: ScheduleRecurrence) => void
}

export function RecurrenceSelect({ value, onChange }: RecurrenceSelectProps) {
  return (
    <div
      className="flex items-center typography-body02-semibold"
      role="group"
      aria-label="반복 주기"
    >
      {RECURRENCE_OPTIONS.map((option, index) => (
        <Fragment key={option}>
          {index > 0 ? (
            <span className="mx-1 text-text-50" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              'transition-colors',
              value === option ? 'text-text-90' : 'text-text-50',
              value === option
                ? 'typography-body02-semibold'
                : 'typography-body02-regular'
            )}
          >
            {option}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
