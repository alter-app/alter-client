import { WorkCategoryBadge } from '@/shared/ui/home/WorkCategoryBadge'
import type { WorkspaceItemDto } from '@/features/manager/home/types/workspace'

interface WorkspaceChangeCardProps {
  workspace: WorkspaceItemDto
  isSelected?: boolean
  className?: string
  onClick?: (workspaceId: number) => void
}

export function WorkspaceChangeCard({
  workspace,
  isSelected = false,
  className = '',
  onClick,
}: WorkspaceChangeCardProps) {
  return (
    <div
      onClick={() => onClick?.(workspace.id)}
      className={`flex h-[86px] w-[310px] relative items-start rounded-2xl px-4 py-4 text-left ${
        isSelected ? 'border border-sub bg-sub-300' : 'bg-bg-dark'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 pr-10">
        <div className="flex min-w-0 items-center gap-2">
          <p className="line-clamp-1 typography-headline03 text-text-100">
            {workspace.businessName}
          </p>
          <WorkCategoryBadge label={workspace.businessType} className="" />
        </div>

        <div className="flex min-w-0 items-center gap-2 typography-body02-regular text-text-100">
          <span className="whitespace-nowrap" title={workspace.fullAddress}>
            {workspace.fullAddress}
          </span>
          <span
            className={`h-4 w-px shrink-0 ${
              isSelected ? 'bg-sub' : 'bg-line-2'
            }`}
            aria-hidden
          />
          <span
            className="min-w-0 flex-1 truncate"
            title={workspace.businessName}
          >
            {workspace.businessName}
          </span>
        </div>
      </div>
    </div>
  )
}

export type { WorkspaceChangeCardProps }
