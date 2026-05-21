import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateNicknameMutation, useUserMe } from '@/features/user/me'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'
import { ROUTES } from '@/shared/constants/routes'

export function NicknameEditPage() {
  const navigate = useNavigate()
  const { user } = useUserMe()
  const updateNicknameMutation = useUpdateNicknameMutation()
  const [nickname, setNickname] = useState(user.nickname)
  const [message, setMessage] = useState('')

  const trimmedNickname = nickname.trim()
  const canSubmit =
    trimmedNickname.length > 0 &&
    trimmedNickname.length <= 64 &&
    trimmedNickname !== user.nickname &&
    !updateNicknameMutation.isPending

  const handleSubmit = async () => {
    setMessage('')
    if (!trimmedNickname) {
      setMessage('닉네임을 입력해 주세요.')
      return
    }
    if (trimmedNickname.length > 64) {
      setMessage('닉네임은 64자 이하로 입력해 주세요.')
      return
    }

    try {
      await updateNicknameMutation.mutateAsync(trimmedNickname)
      navigate(ROUTES.MY.PROFILE, { replace: true })
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '닉네임 변경에 실패했습니다.'))
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
          value={nickname}
          maxLength={64}
          placeholder="닉네임을 입력해 주세요"
          onChange={event => setNickname(event.target.value)}
        />
        <p className="mt-2 pl-1 text-text-50 typography-body03-regular">
          현재 닉네임과 다른 64자 이하의 닉네임을 입력해 주세요.
        </p>
        {message && (
          <p role="alert" className="mt-4 text-error typography-body03-regular">
            {message}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton disabled={!canSubmit} onClick={handleSubmit}>
            변경하기
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
