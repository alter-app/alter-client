import EditIcon from '@/assets/icons/my/edit.svg?react'
import CrownIcon from '@/assets/icons/my/crown.svg?react'

interface ProfileCardProps {
  nickname: string
  realName?: string
  isManager: boolean
  avatarUrl?: string
  onEditClick?: () => void
}

export function ProfileCard({
  nickname,
  realName,
  isManager,
  avatarUrl,
  onEditClick,
}: ProfileCardProps) {
  const roleLabel = isManager ? '사장님' : '알바생'

  return (
    <div className="relative flex h-[120px] w-full flex-col justify-center rounded-2xl bg-white pl-[18px] pr-4">
      <div className="flex items-center gap-3.5">
        <div className="size-[60px] shrink-0 overflow-hidden rounded-full bg-line-2">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={`${nickname} 프로필 이미지`}
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col items-start justify-center gap-0.5">
          <p className="text-text-100 typography-headline01">{nickname}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-main-900">
              <CrownIcon className="size-5" aria-hidden="true" />
              <span className="typography-body02-regular">{roleLabel}</span>
            </div>
            {realName && (
              <>
                <span aria-hidden="true" className="h-3.5 w-px bg-line-2" />
                <span className="text-text-90 typography-body02-regular">
                  {realName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="프로필 수정"
        onClick={onEditClick}
        className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-90"
      >
        <EditIcon className="size-6 [&_*]:!stroke-current" aria-hidden="true" />
      </button>
    </div>
  )
}
