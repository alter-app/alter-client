import { cn } from '@/shared/lib/utils'

interface WeekdayPickerProps {
  options: readonly string[]
  selectedDays: string[]
  onToggleDay: (day: string) => void
}

export function WeekdayPicker({
  options,
  selectedDays,
  onToggleDay,
}: WeekdayPickerProps) {
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-2xl bg-bg-light px-1">
      {options.map(day => {
        const selected = selectedDays.includes(day)
        return (
          <button
            key={day}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggleDay(day)}
            className={cn(
              'flex size-10 items-center justify-center rounded-2xl typography-body03-semibold',
              selected
                ? 'bg-main-900 text-text-100'
                : 'text-text-50 typography-body03-regular'
            )}
          >
            {day}
          </button>
        )
      })}
    </div>
  )
}
