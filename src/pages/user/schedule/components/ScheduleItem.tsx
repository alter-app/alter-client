import type { ScheduleListItem } from '@/features/user'

interface ScheduleItemProps extends ScheduleListItem {
  onClick?: (id: string) => void
}

function getDayColor(day: string) {
  if (day === '토') return 'text-[#1976D2]'
  if (day === '일') return 'text-[#D32F2F]'
  return 'text-text-100'
}

export function ScheduleItem({
  id,
  day,
  date,
  workplace,
  time,
  hours,
  onClick,
}: ScheduleItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  return (
    <button
      type="button"
      onClick={onClick ? handleClick : undefined}
      disabled={!onClick}
      className="flex items-center border-b border-line-1 py-3 last:border-b-0"
    >
      <div className="flex flex-col items-center min-w-[60px] mr-4">
        <span
          className={`font-pretendard font-semibold text-4 ${getDayColor(day)}`}
        >
          {day}
        </span>
        <span className="mt-0.5 font-pretendard text-2 text-text-70">
          {date}일
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="truncate font-pretendard text-3 font-semibold text-text-100">
          {workplace}
        </span>
        <span className="font-pretendard text-2 text-text-70">{time}</span>
      </div>
      <div className="shrink-0 rounded-lg border border-line-1 bg-bg-light px-2 py-1 font-pretendard text-2 font-medium text-text-70">
        {hours}
      </div>
    </button>
  )
}
