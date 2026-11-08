import { WEEK_OF_MONTH_OPTIONS } from '@/features/manager'
import { cn } from '@/shared/lib/utils'

const WEEK_OF_MONTH_LABEL: Record<number, string> = {
  1: '첫째',
  2: '둘째',
  3: '셋째',
  4: '넷째',
  5: '다섯째',
}

interface WeekOfMonthSelectProps {
  value: number | null
  onChange: (value: number) => void
}

export function WeekOfMonthSelect({ value, onChange }: WeekOfMonthSelectProps) {
  return (
    <div
      className="flex h-10 w-full items-center justify-between rounded-2xl bg-bg-light px-1"
      role="group"
      aria-label="매월 반복 주차"
    >
      {WEEK_OF_MONTH_OPTIONS.map(week => {
        const selected = value === week
        return (
          <button
            key={week}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(week)}
            className={cn(
              'flex h-10 flex-1 items-center justify-center rounded-2xl',
              selected
                ? 'bg-main-900 text-text-100 typography-body03-semibold'
                : 'text-text-50 typography-body03-regular'
            )}
          >
            {WEEK_OF_MONTH_LABEL[week]}
          </button>
        )
      })}
    </div>
  )
}
