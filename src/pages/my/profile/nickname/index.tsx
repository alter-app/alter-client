import { useNavigate } from 'react-router-dom'
import { useChangeNickname, useUserMe } from '@/features/user/me'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'
import { ROUTES } from '@/shared/constants/routes'

export function NicknameEditPage() {
  const navigate = useNavigate()
  const { user } = useUserMe()
  const changeNickname = useChangeNickname(user.nickname)

  const handleSubmit = async () => {
    const success = await changeNickname.submit()
    if (success) {
      navigate(ROUTES.MY.PROFILE, { replace: true })
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="닉네임 변경" />
      </div>

      <main className="flex flex-1 flex-col px-5 pt-8">
        <label className="mb-2 pl-1 text-text-100 typography-body01-regular">
          새 닉네임
        </label>
        <AuthInput
          value={changeNickname.nickname}
          maxLength={64}
          placeholder="닉네임을 입력해 주세요"
          onChange={event => changeNickname.setNickname(event.target.value)}
        />
        <p className="mt-2 pl-1 text-text-50 typography-body03-regular">
          현재 닉네임과 다른 64자 이하의 닉네임을 입력해 주세요.
        </p>
        {changeNickname.message && (
          <p role="alert" className="mt-4 text-error typography-body03-regular">
            {changeNickname.message}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton
            disabled={!changeNickname.canSubmit}
            onClick={handleSubmit}
          >
            변경하기
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
