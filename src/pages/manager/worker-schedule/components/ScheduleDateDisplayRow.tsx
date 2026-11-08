import { formatKoreanScheduleDate } from '@/pages/manager/worker-schedule/lib/scheduleDateParts'

interface ScheduleDateDisplayRowProps {
  label: string
  date: Date | null
  onPress: () => void
}

export function ScheduleDateDisplayRow({
  label,
  date,
  onPress,
}: ScheduleDateDisplayRowProps) {
  return (
    <button
      type="button"
      className="flex w-full max-w-[318px] items-center justify-between px-1"
      onClick={onPress}
    >
      <span className="typography-body01-regular text-text-70">{label}</span>
      <span
        className={
          date
            ? 'typography-body02-semibold text-text-100'
            : 'typography-body02-regular text-text-50'
        }
      >
        {date ? formatKoreanScheduleDate(date) : '선택해 주세요'}
      </span>
    </button>
  )
}
