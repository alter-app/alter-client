// 사장님 홈 - 근무자 카드 (원형 이미지 + 이름 + 시간대)
import { Avatar } from '@/shared/ui/common/Avatar'

interface WorkerImageCardProps {
  name: string
  timeRange: string
  imageUrl?: string | null
  className?: string
}

export function WorkerImageCard({
  name,
  timeRange,
  imageUrl,
  className = '',
}: WorkerImageCardProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl bg-white p-4 shadow-sm min-w-[140px] shrink-0 ${className}`}
    >
      <Avatar
        src={imageUrl}
        alt={name}
        size={80}
        className="border border-gray-200"
      />
      <p className="typography-body02-semibold text-gray-900 mt-3 text-center">
        {name}
      </p>
      <p className="typography-body03-regular text-gray-500 mt-1 text-center">
        {timeRange}
      </p>
    </div>
  )
}
