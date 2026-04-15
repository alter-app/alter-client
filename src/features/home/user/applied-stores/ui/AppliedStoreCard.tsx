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
      className={`relative h-[156px] w-[130px] overflow-hidden rounded-2xl ${
        isRejected
          ? 'bg-[linear-gradient(152deg,#3a9982_5.7%,#9dccc1_92.6%)]'
          : 'bg-[linear-gradient(152deg,#2ce283_5.7%,#c0f7da_92.6%)]'
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
