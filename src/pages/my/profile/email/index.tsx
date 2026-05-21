import { useState } from 'react'
import {
  useDeleteEmailMutation,
  useSendEmailVerificationMutation,
  useUpdateEmailMutation,
  useUserMe,
  useVerifyEmailCodeMutation,
} from '@/features/user/me'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import useAuthStore from '@/shared/stores/useAuthStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { Navbar } from '@/shared/ui/common/Navbar'

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function EmailEditPage() {
  const { user } = useUserMe()
  const authUser = useAuthStore(state => state.user)
  const sendEmailVerificationMutation = useSendEmailVerificationMutation()
  const verifyEmailCodeMutation = useVerifyEmailCodeMutation()
  const updateEmailMutation = useUpdateEmailMutation()
  const deleteEmailMutation = useDeleteEmailMutation()

  const currentEmail = user.email || authUser?.email || ''
  const [email, setEmail] = useState(currentEmail)
  const [code, setCode] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isPending =
    sendEmailVerificationMutation.isPending ||
    verifyEmailCodeMutation.isPending ||
    updateEmailMutation.isPending ||
    deleteEmailMutation.isPending
  const trimmedEmail = email.trim()
  const canSend = isEmailValid(trimmedEmail) && !isPending
  const canVerify =
    isEmailValid(trimmedEmail) && code.trim().length > 0 && !isPending
  const canUpdate = Boolean(sessionId) && !isPending
  const canDelete = Boolean(currentEmail) && !isPending

  const clearMessages = () => {
    setMessage('')
    setSuccessMessage('')
  }

  const handleSend = async () => {
    clearMessages()
    if (!isEmailValid(trimmedEmail)) {
      setMessage('올바른 이메일을 입력해 주세요.')
      return
    }

    try {
      await sendEmailVerificationMutation.mutateAsync(trimmedEmail)
      setSessionId('')
      setSuccessMessage('인증 코드가 발송되었습니다.')
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '인증 코드 발송에 실패했습니다.'))
    }
  }

  const handleVerify = async () => {
    clearMessages()
    try {
      const nextSessionId = await verifyEmailCodeMutation.mutateAsync({
        email: trimmedEmail,
        code: code.trim(),
      })
      setSessionId(nextSessionId)
      setSuccessMessage('이메일 인증이 완료되었습니다.')
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '인증 코드 확인에 실패했습니다.'))
    }
  }

  const handleUpdate = async () => {
    clearMessages()
    try {
      await updateEmailMutation.mutateAsync(sessionId)
      setSuccessMessage('이메일이 등록/변경되었습니다.')
    } catch (error) {
      setMessage(
        getAxiosErrorMessage(error, '이메일 등록/변경에 실패했습니다.')
      )
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('등록된 이메일을 삭제할까요?')) return
    clearMessages()
    try {
      await deleteEmailMutation.mutateAsync()
      setEmail('')
      setCode('')
      setSessionId('')
      setSuccessMessage('이메일이 삭제되었습니다.')
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '이메일 삭제에 실패했습니다.'))
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar
          variant="detail"
          title="이메일 관리"
          rightAction={
            canDelete ? (
              <button
                type="button"
                onClick={handleDelete}
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
              value={email}
              placeholder="이메일을 입력해 주세요"
              autoComplete="email"
              onChange={event => {
                setEmail(event.target.value)
                setSessionId('')
              }}
            />
            <button
              type="button"
              disabled={!canSend}
              onClick={handleSend}
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
              value={code}
              placeholder="인증 코드를 입력해 주세요"
              inputMode="numeric"
              onChange={event => {
                setCode(event.target.value)
                setSessionId('')
              }}
            />
            <button
              type="button"
              disabled={!canVerify}
              onClick={handleVerify}
              className="h-14 min-w-[88px] rounded-xl bg-main px-4 text-white disabled:bg-text-50 typography-body02-regular"
            >
              확인
            </button>
          </div>
        </div>

        {message && (
          <p role="alert" className="text-error typography-body03-regular">
            {message}
          </p>
        )}
        {successMessage && (
          <p role="status" className="text-main typography-body03-regular">
            {successMessage}
          </p>
        )}

        <div className="mt-auto pb-8">
          <AuthButton disabled={!canUpdate} onClick={handleUpdate}>
            이메일 등록/변경
          </AuthButton>
        </div>
      </main>
    </div>
  )
}
