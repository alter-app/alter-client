import { cn } from '@/shared/lib/utils'
import { WorkerScheduleGauge } from './WorkerScheduleGauge'

interface WorkerScheduleCellProps {
  dayText: string
  isCurrentMonth: boolean
  isSaturday: boolean
  isSunday: boolean
  isToday: boolean
  workerColors: string[]
}

export function WorkerScheduleCell({
  dayText,
  isCurrentMonth,
  isSaturday,
  isSunday,
  isToday,
  workerColors,
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
      className={cn(
        'flex size-12 items-center justify-center',
        isToday && 'rounded-lg bg-bg-dark'
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
