import EditIcon from '@/assets/icons/my/edit.svg?react'
import CrownIcon from '@/assets/icons/my/crown.svg?react'
import { Avatar } from '@/shared/ui/common/Avatar'

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
    <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(35,35,35,0.06)]">
      <div className="flex items-center gap-3.5">
        <Avatar
          src={avatarUrl}
          alt={`${nickname} 프로필 이미지`}
          size={64}
          className="ring-4 ring-white"
        />
        <div className="relative flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
          <p className="text-text-100 typography-headline01">{nickname}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-sub shadow-sm">
              <CrownIcon className="size-4" aria-hidden="true" />
              <span className="typography-body03-semibold">{roleLabel}</span>
            </div>
            {realName && (
              <>
                <span aria-hidden="true" className="h-3 w-px bg-line-2" />
                <span className="truncate text-text-70 typography-body02-regular">
                  {realName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="내 정보 수정"
        onClick={onEditClick}
        className="relative mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-main-300 bg-white/90 text-sub transition-colors hover:bg-white active:bg-main-100 typography-body02-semibold"
      >
        <EditIcon className="size-4 [&_*]:!stroke-current" aria-hidden="true" />
        내 정보 수정
      </button>
    </section>
  )
}
