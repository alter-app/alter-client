import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { useUpdatePasswordMutation } from './useUserMeMutations'
import { useState } from 'react'

function isPasswordFormatValid(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length < 8 || trimmed.length > 16) return false
  const hasLetter = /[A-Za-z]/.test(trimmed)
  const hasNumber = /\d/.test(trimmed)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed)
  return hasLetter && hasNumber && hasSpecial
}

export function usePasswordUpdateFeature(options: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const navigate = useNavigate()
  const updatePasswordMutation = useUpdatePasswordMutation()
  const [message, setMessage] = useState('')

  const validate = (): string => {
    if (!isPasswordFormatValid(options.newPassword)) {
      return '새 비밀번호는 8~16자, 영문·숫자·특수문자를 모두 포함해야 합니다.'
    }
    if (options.newPassword !== options.confirmPassword) {
      return '새 비밀번호가 일치하지 않습니다.'
    }
    return ''
  }

  const canSubmit = !validate() && !updatePasswordMutation.isPending

  const handleSubmit = async () => {
    setMessage('')
    const validationMessage = validate()
    if (validationMessage) {
      setMessage(validationMessage)
      return
    }

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: options.currentPassword.trim() || undefined,
        newPassword: options.newPassword,
      })
      navigate(ROUTES.MY.PROFILE, { replace: true })
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '비밀번호 변경에 실패했습니다.'))
    }
  }

  return {
    message,
    canSubmit,
    validate,
    handleSubmit,
  }
}
