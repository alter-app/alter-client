import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/shared/stores/useAuthStore'
import { useProfileImageEditor, useUserMe } from '@/features/user/me'
import { ROUTES } from '@/shared/constants/routes'
import { Navbar } from '@/shared/ui/common/Navbar'
import { MenuListItem } from '../components/MenuListItem'
import { ReadOnlyField } from './components/ReadOnlyField'
import CameraCircleIcon from '@/assets/icons/my/camera-circle.svg?react'

interface DeleteProfileImageModalProps {
  open: boolean
  pending: boolean
  onClose: () => void
  onConfirm: () => void
}

function DeleteProfileImageModal({
  open,
  pending,
  onClose,
  onConfirm,
}: DeleteProfileImageModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={pending ? undefined : onClose}
      />
      <div
        className="relative w-full max-w-[318px] overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-profile-image-title"
      >
        <div className="px-5 pb-5 pt-6 text-center">
          <h2
            id="delete-profile-image-title"
            className="text-text-100 typography-headline03"
          >
            프로필 이미지를 삭제할까요?
          </h2>
          <p className="mt-2 text-text-70 typography-body02-regular">
            삭제하면 기본 프로필 이미지로 표시됩니다.
          </p>
        </div>
        <div className="flex border-t border-line-2">
          <button
            type="button"
            disabled={pending}
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center text-text-70 disabled:text-text-50 typography-body01-regular"
          >
            취소
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="flex h-12 flex-1 items-center justify-center border-l border-line-2 text-error disabled:text-text-50 typography-body01-semibold"
          >
            {pending ? '삭제 중' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { user: authUser } = useAuthStore()
  const { user, isError } = useUserMe()

  const email = user.email || authUser?.email || '등록된 이메일이 없습니다.'
  const phone = user.phone || '제공되지 않음'
  const joinedAt = user.joinedAtFormatted
  const nickname = user.nickname || authUser?.name || '알터'
  const avatarUrl = user.profileImageUrl
  const {
    fileInputRef,
    imageError,
    isImagePending,
    deleteModalOpen,
    isDeletePending,
    triggerFileInput,
    onFileChange,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useProfileImageEditor(avatarUrl)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar
          variant="detail"
          title="프로필 수정"
          rightAction={
            avatarUrl ? (
              <button
                type="button"
                onClick={openDeleteModal}
                disabled={isImagePending}
                className="text-error disabled:text-text-50 typography-body02-regular"
              >
                삭제
              </button>
            ) : null
          }
        />
      </div>

      <div className="flex flex-col items-center pt-10">
        <div className="relative">
          <div className="size-[146px] overflow-hidden rounded-full bg-line-2">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={`${nickname} 프로필 이미지`}
                className="size-full object-cover"
              />
            )}
          </div>
          <button
            type="button"
            aria-label="프로필 이미지 변경"
            onClick={triggerFileInput}
            disabled={isImagePending}
            className="absolute -bottom-1 -right-1 flex size-10 items-center justify-center"
          >
            <CameraCircleIcon className="size-10" aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        {imageError && (
          <p
            role="alert"
            className="mt-3 px-6 text-error typography-body03-regular"
          >
            {imageError}
          </p>
        )}
      </div>
      <DeleteProfileImageModal
        open={deleteModalOpen}
        pending={isDeletePending}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <div className="mt-10 flex flex-col">
        <MenuListItem
          label="닉네임 변경"
          onClick={() => navigate(ROUTES.MY.PROFILE_NICKNAME)}
        />
        <MenuListItem
          label="비밀번호 변경"
          onClick={() => navigate(ROUTES.MY.PROFILE_PASSWORD)}
        />
        <MenuListItem
          label="이메일 관리"
          onClick={() => navigate(ROUTES.MY.PROFILE_EMAIL)}
        />
        <MenuListItem
          label="소셜 계정 관리"
          onClick={() => navigate(ROUTES.MY.PROFILE_SOCIAL)}
          isLast
        />
      </div>

      <div className="mt-[30px] flex flex-col gap-[17px] px-[23px]">
        <ReadOnlyField label="이메일" value={email} />
        <ReadOnlyField label="핸드폰 번호" value={phone} />
      </div>

      <div className="mt-auto pb-10 pt-6 text-center">
        <p className="text-text-50 typography-body03-regular">가입 날짜</p>
        <p className="text-text-50 typography-body03-regular">{joinedAt}</p>
        {isError && (
          <p role="alert" className="mt-2 text-error typography-body03-regular">
            사용자 정보를 불러오지 못했습니다.
          </p>
        )}
      </div>
    </div>
  )
}
