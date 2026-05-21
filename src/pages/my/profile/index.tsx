import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/shared/stores/useAuthStore'
import {
  useDeleteProfileImageMutation,
  useUpdateProfileImageMutation,
  useUserMe,
} from '@/features/user/me'
import { ROUTES } from '@/shared/constants/routes'
import { Navbar } from '@/shared/ui/common/Navbar'
import { uploadAppFile } from '@/features/store-register/api/workspaceFileUpload'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { MenuListItem } from '../components/MenuListItem'
import { ReadOnlyField } from './components/ReadOnlyField'
import CameraCircleIcon from '@/assets/icons/my/camera-circle.svg?react'

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { user: authUser } = useAuthStore()
  const { user, isError } = useUserMe()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageError, setImageError] = useState('')
  const updateProfileImageMutation = useUpdateProfileImageMutation()
  const deleteProfileImageMutation = useDeleteProfileImageMutation()

  const email = user.email || authUser?.email || '등록된 이메일이 없습니다.'
  const phone = user.phone || '제공되지 않음'
  const joinedAt = user.joinedAtFormatted
  const nickname = user.nickname || authUser?.name || '알터'
  const avatarUrl = user.profileImageUrl
  const isImagePending =
    updateProfileImageMutation.isPending || deleteProfileImageMutation.isPending

  const handleAvatarUpload = () => {
    setImageError('')
    fileInputRef.current?.click()
  }

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const fileId = await uploadAppFile({
        file,
        targetType: 'USER_PROFILE',
        bucketType: 'PUBLIC',
      })
      await updateProfileImageMutation.mutateAsync(fileId)
    } catch (error) {
      setImageError(
        getAxiosErrorMessage(error, '프로필 이미지 변경에 실패했습니다.')
      )
    }
  }

  const handleDeleteAvatar = async () => {
    if (!avatarUrl || !window.confirm('프로필 이미지를 삭제할까요?')) return
    setImageError('')
    try {
      await deleteProfileImageMutation.mutateAsync()
    } catch (error) {
      setImageError(
        getAxiosErrorMessage(error, '프로필 이미지 삭제에 실패했습니다.')
      )
    }
  }

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
                onClick={handleDeleteAvatar}
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
            onClick={handleAvatarUpload}
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
            onChange={handleAvatarFileChange}
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
