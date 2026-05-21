import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdatePasswordMutation } from '@/features/user/me'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'
import { ROUTES } from '@/shared/constants/routes'

function isPasswordFormatValid(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 8 || trimmed.length > 16) return false
  const hasLetter = /[A-Za-z]/.test(trimmed)
  const hasNumber = /\d/.test(trimmed)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed)
  return hasLetter && hasNumber && hasSpecial
}

export function PasswordEditPage() {
  const navigate = useNavigate()
  const updatePasswordMutation = useUpdatePasswordMutation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit =
    isPasswordFormatValid(newPassword) &&
    newPassword === confirmPassword &&
    !updatePasswordMutation.isPending

  const handleSubmit = async () => {
    setMessage('')
    if (!isPasswordFormatValid(newPassword)) {
      setMessage(
        '새 비밀번호는 8~16자, 영문·숫자·특수문자를 모두 포함해야 합니다.'
      )
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: currentPassword.trim() || undefined,
        newPassword,
      })
      navigate(ROUTES.MY.PROFILE, { replace: true })
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '비밀번호 변경에 실패했습니다.'))
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="비밀번호 변경" />
      </div>

      <main className="flex flex-1 flex-col gap-5 px-5 pt-8">
        <div>
          <label className="mb-2 block pl-1 text-text-100 typography-body01-regular">
            현재 비밀번호
          </label>
          <AuthInput
            type="password"
            value={currentPassword}
            placeholder="소셜 전용 계정은 생략할 수 있어요"
            autoComplete="current-password"
            onChange={event => setCurrentPassword(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block pl-1 text-text-100 typography-body01-regular">
            새 비밀번호
          </label>
          <AuthInput
            type="password"
            value={newPassword}
            placeholder="8~16자 영문, 숫자, 특수문자"
            autoComplete="new-password"
            onChange={event => setNewPassword(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block pl-1 text-text-100 typography-body01-regular">
            새 비밀번호 확인
          </label>
          <AuthInput
            type="password"
            value={confirmPassword}
            placeholder="새 비밀번호를 다시 입력해 주세요"
            autoComplete="new-password"
            onChange={event => setConfirmPassword(event.target.value)}
          />
        </div>

        {message && (
          <p role="alert" className="text-error typography-body03-regular">
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
