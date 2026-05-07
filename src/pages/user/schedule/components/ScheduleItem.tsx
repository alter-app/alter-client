import type { ScheduleListItem } from '@/features/user/home/schedule/types/scheduleList'

interface ScheduleItemProps extends ScheduleListItem {
  onClick?: (id: string) => void
}

function getDayColor(day: string) {
  if (day === '토') return 'text-[#1976D2]'
  if (day === '일') return 'text-[#D32F2F]'
  return 'text-[#333333]'
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
      className="flex items-center py-3 border-b border-[#f0f0f0] last:border-b-0"
    >
      <div className="flex flex-col items-center min-w-[60px] mr-4">
        <span
          className={`font-pretendard font-semibold text-4 ${getDayColor(day)}`}
        >
          {day}
        </span>
        <span className="font-pretendard font-regular text-2 text-[#666666] mt-0.5">
          {date}일
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <span className="font-pretendard font-semibold text-3 text-[#333333] truncate">
          {workplace}
        </span>
        <span className="font-pretendard font-regular text-2 text-[#666666]">
          {time}
        </span>
      </div>
      <div className="py-1 px-2 bg-[#f8f9fa] rounded-lg font-pretendard font-medium text-2 text-[#666666] border border-[#e9ecef] shrink-0">
        {hours}
      </div>
    </button>
  )
}
