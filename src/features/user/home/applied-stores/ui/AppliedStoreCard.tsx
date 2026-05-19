import { ApplicationStatusBadge } from '@/shared/ui/home/ApplicationStatusBadge'

interface AppliedStoreCardProps {
  storeName: string
  status?: 'applied' | 'rejected'
}

export function AppliedStoreCard({
  storeName,
  status = 'applied',
}: AppliedStoreCardProps) {
  const isRejected = status === 'rejected'

  return (
    <div
      className={`relative h-[156px] w-[130px] overflow-hidden rounded-2xl bg-gradient-to-br ${
        isRejected ? 'from-sub to-sub-900' : 'from-main to-main-300'
      }`}
    >
      <p
        className={`absolute left-3 top-3 max-w-16 whitespace-normal break-words line-clamp-4 typography-body02-semibold ${
          isRejected ? 'text-white' : 'text-text-100'
        }`}
      >
        {storeName}
      </p>
      <ApplicationStatusBadge
        status={status}
        className="absolute bottom-3 right-[10px]"
      />
    </div>
  )
}

export type { AppliedStoreCardProps }
