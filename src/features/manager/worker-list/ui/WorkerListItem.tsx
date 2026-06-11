import EditIcon from '@/assets/icons/home/edit.svg'
import TrashIcon from '@/assets/icons/social/trash.svg'
import type { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import { SwipeActionButton } from '@/shared/ui/SwipeActionButton'
import { SwipeableRow } from '@/shared/ui/SwipeableRow'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { Avatar } from '@/shared/ui/common/Avatar'
import type { WorkerRole } from '@/shared/types/workerRole'

interface WorkerListItemProps {
  name: string
  workspaceName: string
  nextShiftTime: string
  scheduleColor: ScheduleColor
  role: WorkerRole
  profileImageUrl?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function WorkerListItem({
  name,
  workspaceName,
  nextShiftTime,
  scheduleColor,
  role,
  profileImageUrl,
  onEdit,
  onDelete,
}: WorkerListItemProps) {
  const content = (
    <div className="flex h-[70px] min-w-[358px] items-center justify-between bg-white px-6 py-1">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar src={profileImageUrl} alt={`${name} 프로필`} size={38} />
          <div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `inset 0 0 0 3px ${scheduleColor}` }}
            aria-hidden
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="typography-body01-semibold text-black">{name}</span>
          <div className="flex gap-1 typography-doc text-text-70">
            <span>{workspaceName}</span>
            <span>{nextShiftTime}</span>
          </div>
        </div>
      </div>

      <WorkerRoleBadge role={role} />
    </div>
  )

  if (!onEdit && !onDelete) return content

  return (
    <SwipeableRow
      actions={
        <>
          {onEdit && (
            <SwipeActionButton
              icon={EditIcon}
              label="수정"
              onClick={onEdit}
              variant="edit"
            />
          )}
          {onDelete && (
            <SwipeActionButton
              icon={TrashIcon}
              label="삭제"
              onClick={onDelete}
              variant="delete"
            />
          )}
        </>
      }
    >
      {content}
    </SwipeableRow>
  )
}
