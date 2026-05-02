import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/shared/stores/useAuthStore'
import { Navbar } from '@/shared/ui/common/Navbar'
import { MenuListItem } from '../components/MenuListItem'
import { ReadOnlyField } from './components/ReadOnlyField'
import CameraCircleIcon from '@/assets/icons/my/camera-circle.svg?react'

const MOCK_PROFILE = {
  email: '123456789@gmail.com',
  phone: '010-1234-5678',
  joinedAt: '2100.10.10',
}

export function ProfileEditPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const email = user?.email || MOCK_PROFILE.email
  const phone = MOCK_PROFILE.phone
  const joinedAt = MOCK_PROFILE.joinedAt
  const nickname = user?.name || '알터'
  const avatarUrl: string | undefined = undefined

  const handleAvatarUpload = () => {}

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="프로필 수정" />
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
            className="absolute -bottom-1 -right-1 flex size-10 items-center justify-center"
          >
            <CameraCircleIcon className="size-10" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-10 flex flex-col">
        <MenuListItem
          label="닉네임 변경"
          onClick={() => navigate('/my/profile/nickname')}
        />
        <MenuListItem
          label="비밀번호 변경"
          onClick={() => navigate('/my/profile/password')}
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
      </div>
    </div>
  )
}
