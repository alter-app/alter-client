// 사장님 홈 - 근무자 카드 (원형 이미지 + 이름 + 시간대)

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
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] [background-size:12px_12px]"
            aria-hidden
          />
        )}
      </div>
      <p className="typography-body02-semibold text-gray-900 mt-3 text-center">
        {name}
      </p>
      <p className="typography-body03-regular text-gray-500 mt-1 text-center">
        {timeRange}
      </p>
    </div>
  )
}
