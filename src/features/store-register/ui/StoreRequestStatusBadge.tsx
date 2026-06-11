import { resolveStatusBadge } from '@/features/store-register/lib/requestStatus'

type Props = {
  status: { value: string; description?: string }
}

/** 신청 상태 배지 — 4상태(PENDING/ACTIVATED/REVOKED/CANCELED) */
export function StoreRequestStatusBadge({ status }: Props) {
  const { label, badgeClass } = resolveStatusBadge(status)
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center justify-center rounded-[60px] border px-3 typography-body02-semibold ${badgeClass}`}
    >
      {label}
    </span>
  )
}
