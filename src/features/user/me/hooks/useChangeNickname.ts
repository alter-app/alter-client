import {
  isNicknameFormatValid,
  NICKNAME_GUIDE_MESSAGE,
} from '@/shared/lib/utils/nicknameValidation'
import { checkNicknameDuplicate } from '@/shared/api/auth'
import { useState } from 'react'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { useUpdateNicknameMutation } from './useUserMeMutations'

export function useChangeNickname(currentNickname: string) {
  const updateNicknameMutation = useUpdateNicknameMutation()
  // 조회가 늦게 완료되어도 기존 닉네임을 원문 그대로 표시한다.
  const [editedNickname, setNickname] = useState<string | null>(null)
  const nickname = editedNickname ?? currentNickname
  const [message, setMessage] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  const canSubmit =
    isNicknameFormatValid(nickname) &&
    nickname !== currentNickname &&
    !isChecking &&
    !updateNicknameMutation.isPending

  const submit = async (): Promise<boolean> => {
    if (isChecking || updateNicknameMutation.isPending) return false
    setMessage('')
    if (!isNicknameFormatValid(nickname)) {
      setMessage(NICKNAME_GUIDE_MESSAGE)
      return false
    }
    if (nickname === currentNickname) {
      setMessage('현재 닉네임과 다른 닉네임을 입력해 주세요.')
      return false
    }

    try {
      setIsChecking(true)
      const available = await checkNicknameDuplicate(nickname)
      if (!available) {
        setMessage('이미 사용 중인 닉네임입니다.')
        return false
      }
      await updateNicknameMutation.mutateAsync(nickname)
      return true
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '닉네임 변경에 실패했습니다.'))
      return false
    } finally {
      setIsChecking(false)
    }
  }

  return {
    nickname,
    isBusy: isChecking || updateNicknameMutation.isPending,
    setNickname: (value: string) => {
      setNickname(value)
      setMessage(
        value && !isNicknameFormatValid(value) ? NICKNAME_GUIDE_MESSAGE : ''
      )
    },
    message,
    canSubmit,
    submit,
  }
}
