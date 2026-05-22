import { cn } from '@/shared/lib/utils'
import { WorkerScheduleGauge } from './WorkerScheduleGauge'

interface WorkerScheduleCellProps {
  dayText: string
  isCurrentMonth: boolean
  isSaturday: boolean
  isSunday: boolean
  isSelected: boolean
  workerColors: string[]
  onClick?: () => void
}

export function WorkerScheduleCell({
  dayText,
  isCurrentMonth,
  isSaturday,
  isSunday,
  isSelected,
  workerColors,
  onClick,
}: WorkerScheduleCellProps) {
  const dayTextColor = !isCurrentMonth
    ? 'text-text-50'
    : isSaturday
      ? 'text-subBlue'
      : isSunday
        ? 'text-error'
        : 'text-text-100'

  const hasWorkers = workerColors.length > 0

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex size-12 items-center justify-center',
        isSelected && 'rounded-lg bg-bg-dark',
        onClick && 'cursor-pointer'
      )}
    >
      {hasWorkers ? (
        <div className="relative flex size-8 items-center justify-center">
          <WorkerScheduleGauge workerColors={workerColors} />
          <span
            className={cn(
              'absolute tabular-nums typography-body03-semibold',
              dayTextColor
            )}
          >
            {dayText}
          </span>
        </div>
      ) : (
        <span
          className={cn(
            'tabular-nums',
            isCurrentMonth
              ? 'typography-body03-semibold'
              : 'typography-body03-regular',
            dayTextColor
          )}
        >
          {dayText}
        </span>
      )}
    </div>
  )
}
