import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import useAuthStore from '@/shared/stores/useAuthStore'
import { useWithdrawUserMutation } from './useUserMeMutations'

export function useWithdrawUserFlow() {
  const navigate = useNavigate()
  const logout = useAuthStore(state => state.logout)
  const scope = useAuthStore(state => state.scope)
  const withdrawUserMutation = useWithdrawUserMutation()
  const isPerformingWithdrawRef = useRef(false)
  const [message, setMessage] = useState('')

  const performWithdraw = async () => {
    if (isPerformingWithdrawRef.current || withdrawUserMutation.isPending) {
      return
    }

    isPerformingWithdrawRef.current = true
    setMessage('')

    try {
      if (
        !window.confirm('정말 탈퇴하시겠어요? 이 작업은 되돌릴 수 없습니다.')
      ) {
        return
      }

      await withdrawUserMutation.mutateAsync()
      logout()
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    } catch (error) {
      const fallback =
        scope === 'MANAGER'
          ? '운영 중인 업장이 있으면 탈퇴할 수 없습니다.'
          : '회원 탈퇴에 실패했습니다.'
      setMessage(getAxiosErrorMessage(error, fallback))
    } finally {
      isPerformingWithdrawRef.current = false
    }
  }

  return {
    message,
    setMessage,
    isPending: withdrawUserMutation.isPending,
    performWithdraw,
  }
}
