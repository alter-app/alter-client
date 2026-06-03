import { useEffect, useState } from 'react'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  useDeleteEmailMutation,
  useSendEmailVerificationMutation,
  useUpdateEmailMutation,
  useVerifyEmailCodeMutation,
} from './useUserMeMutations'

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function useEmailVerificationFlow(currentEmail: string) {
  const sendEmailVerificationMutation = useSendEmailVerificationMutation()
  const verifyEmailCodeMutation = useVerifyEmailCodeMutation()
  const updateEmailMutation = useUpdateEmailMutation()
  const deleteEmailMutation = useDeleteEmailMutation()

  const [email, setEmailState] = useState(currentEmail)
  const [code, setCodeState] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        setEmailState(currentEmail || '')
      }
    })
    return () => {
      cancelled = true
    }
  }, [currentEmail])

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

  const setEmail = (value: string) => {
    setEmailState(value)
    setSessionId('')
  }

  const setCode = (value: string) => {
    setCodeState(value)
    setSessionId('')
  }

  const send = async () => {
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

  const verify = async () => {
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

  const update = async () => {
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

  const deleteEmail = async () => {
    clearMessages()
    try {
      await deleteEmailMutation.mutateAsync()
      setEmailState('')
      setCodeState('')
      setSessionId('')
      setSuccessMessage('이메일이 삭제되었습니다.')
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '이메일 삭제에 실패했습니다.'))
    }
  }

  return {
    email,
    code,
    sessionId,
    message,
    successMessage,
    isPending,
    trimmedEmail,
    canSend,
    canVerify,
    canUpdate,
    canDelete,
    setEmail,
    setCode,
    clearMessages,
    send,
    verify,
    update,
    deleteEmail,
  }
}
