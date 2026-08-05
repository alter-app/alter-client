import { ManagerPostingStatusBadge } from '@/features/manager/posting/ui/ManagerPostingStatusBadge'
import type { PostingStatus } from '@/features/manager/posting/types/posting'

interface PostingDetailHeaderProps {
  title: string
  workspaceName: string
  businessType: string
  status: PostingStatus
}

export function PostingDetailHeader({
  title,
  workspaceName,
  businessType,
  status,
}: PostingDetailHeaderProps) {
  return (
    <section className="py-4">
      <h1 className="typography-headline02 text-text-100">{title}</h1>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="typography-body02-regular text-text-70">
          {workspaceName} · {businessType}
        </p>
        <ManagerPostingStatusBadge status={status} size="md" />
      </div>
    </section>
  )
}
