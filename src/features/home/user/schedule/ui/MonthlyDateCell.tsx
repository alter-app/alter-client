import { MonthlyDateGauge } from '@/features/home/user/schedule/ui/MonthlyDateGauge'

interface MonthlyDateCellProps {
  dayText: string
  isCurrentMonth: boolean
  isWeekend: boolean
  isSelected: boolean
  isActiveDay: boolean
  gaugeRatio?: number
}

export function MonthlyDateCell({
  dayText,
  isCurrentMonth,
  isWeekend,
  isSelected,
  isActiveDay,
  gaugeRatio = 0,
}: MonthlyDateCellProps) {
  const dayTextColor = !isCurrentMonth
    ? 'text-text-50'
    : isWeekend
      ? 'text-[#DC0000]'
      : 'text-text-50'

  return (
    <div
      className={`mx-auto flex h-12 w-12 items-center justify-center ${
        isSelected ? 'bg-bg-light' : ''
      }`}
    >
      {isActiveDay ? (
        <div className="relative flex h-8 w-8 items-center justify-center">
          <MonthlyDateGauge gaugeRatio={gaugeRatio} />
          <span className="typography-body03-semibold text-text-100">
            {dayText}
          </span>
        </div>
      ) : (
        <p className={`typography-body03-regular ${dayTextColor}`}>{dayText}</p>
      )}
    </div>
  )
}
