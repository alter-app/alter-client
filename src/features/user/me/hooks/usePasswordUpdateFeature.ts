import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { validatePasswordWithConfirm } from '@/shared/lib/utils/passwordValidation'
import { useUpdatePasswordMutation } from './useUserMeMutations'
import { useState } from 'react'

export function usePasswordUpdateFeature(options: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  const navigate = useNavigate()
  const updatePasswordMutation = useUpdatePasswordMutation()
  const [message, setMessage] = useState('')
  const currentPassword = options.currentPassword.trim()
  const newPassword = options.newPassword.trim()
  const confirmPassword = options.confirmPassword.trim()

  const validate = (): string =>
    validatePasswordWithConfirm(newPassword, confirmPassword)

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
        currentPassword: currentPassword || undefined,
        newPassword,
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
