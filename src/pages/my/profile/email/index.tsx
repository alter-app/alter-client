import { useEmailVerificationFlow, useUserMe } from '@/features/user/me'
import useAuthStore from '@/shared/stores/useAuthStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'

export function EmailEditPage() {
  const { user } = useUserMe()
  const authUser = useAuthStore(state => state.user)
  const currentEmail = user.email || authUser?.email || ''
  const emailFlow = useEmailVerificationFlow(currentEmail)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar
          variant="detail"
          title="이메일 관리"
          rightAction={
            emailFlow.canDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('등록된 이메일을 삭제할까요?')) {
                    void emailFlow.deleteEmail()
                  }
                }}
                className="text-error typography-body02-regular"
              >
                삭제
              </button>
            ) : null
          }
        />
      </div>

      <main className="flex flex-1 flex-col gap-5 px-5 pt-8">
        <div className="rounded-2xl bg-bg-dark px-4 py-3">
          <p className="text-text-50 typography-body03-regular">현재 이메일</p>
          <p className="mt-1 text-text-100 typography-body01-regular">
            {currentEmail || '등록된 이메일이 없습니다.'}
          </p>
        </div>

        <div>
          <label className="mb-2 block pl-1 text-text-100 typography-body01-regular">
            이메일
          </label>
          <div className="flex gap-2">
            <AuthInput
              type="email"
              value={emailFlow.email}
              placeholder="이메일을 입력해 주세요"
              autoComplete="email"
              onChange={event => emailFlow.setEmail(event.target.value)}
            />
            <button
              type="button"
              disabled={!emailFlow.canSend}
              onClick={() => void emailFlow.send()}
              className="h-14 min-w-[88px] rounded-xl bg-main px-4 text-white disabled:bg-text-50 typography-body02-regular"
            >
              발송
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block pl-1 text-text-100 typography-body01-regular">
            인증 코드
          </label>
          <div className="flex gap-2">
            <AuthInput
              value={emailFlow.code}
              placeholder="인증 코드를 입력해 주세요"
              inputMode="numeric"
              onChange={event => emailFlow.setCode(event.target.value)}
            />
            <button
              type="button"
              disabled={!emailFlow.canVerify}
              onClick={() => void emailFlow.verify()}
              className="h-14 min-w-[88px] rounded-xl bg-main px-4 text-white disabled:bg-text-50 typography-body02-regular"
            >
              확인
            </button>
          </div>
        </div>

        {emailFlow.message && (
          <p role="alert" className="text-error typography-body03-regular">
            {emailFlow.message}
          </p>
        )}
        {emailFlow.successMessage && (
          <p role="status" className="text-main typography-body03-regular">
            {emailFlow.successMessage}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton
            disabled={!emailFlow.canUpdate}
            onClick={() => void emailFlow.update()}
          >
            이메일 등록/변경
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
