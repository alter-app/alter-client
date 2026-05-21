import { useState } from 'react'
import { usePasswordUpdateFeature } from '@/features/user/me'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'

export function PasswordEditPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordUpdate = usePasswordUpdateFeature({
    currentPassword,
    newPassword,
    confirmPassword,
  })

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

        {passwordUpdate.message && (
          <p role="alert" className="text-error typography-body03-regular">
            {passwordUpdate.message}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton
            disabled={!passwordUpdate.canSubmit}
            onClick={passwordUpdate.handleSubmit}
          >
            변경하기
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
