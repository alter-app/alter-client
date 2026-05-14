import { MonthlyDateGauge } from '@/features/home/common/schedule/ui/MonthlyDateGauge'
import { cn } from '@/shared/lib/utils'

interface MonthlyDateCellProps {
  dayText: string
  isCurrentMonth: boolean
  isSaturday: boolean
  isSunday: boolean
  isSelected: boolean
  isActiveDay: boolean
  gaugeRatio?: number
  /** 전달 시 해당 칸은 버튼으로 렌더(일 선택 등) */
  onClick?: () => void
}

export function MonthlyDateCell({
  dayText,
  isCurrentMonth,
  isSaturday,
  isSunday,
  isSelected,
  isActiveDay,
  gaugeRatio = 0,
  onClick,
}: MonthlyDateCellProps) {
  const dayTextColor = !isCurrentMonth
    ? 'text-text-50'
    : isSaturday
      ? 'text-subBlue'
      : isSunday
        ? 'text-error'
        : 'text-text-50'

  const shellClass = cn(
    'mx-auto flex h-12 w-12 items-center justify-center',
    isSelected && 'bg-bg-light',
    onClick &&
      'cursor-pointer rounded-xl border border-transparent hover:bg-bg-light/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main'
  )

  const body = isActiveDay ? (
    <div className="relative flex h-8 w-8 items-center justify-center">
      <MonthlyDateGauge gaugeRatio={gaugeRatio} />
      <span className="typography-body03-semibold text-text-100">
        {dayText}
      </span>
    </div>
  ) : (
    <span className={cn('typography-body03-regular', dayTextColor)}>
      {dayText}
    </span>
  )

  if (onClick) {
    return (
      <button type="button" className={shellClass} onClick={onClick}>
        {body}
      </button>
    )
  }

  return <div className={shellClass}>{body}</div>
}
