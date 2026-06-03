import { useState } from 'react'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { useUpdateNicknameMutation } from './useUserMeMutations'

export function useChangeNickname(currentNickname: string) {
  const updateNicknameMutation = useUpdateNicknameMutation()
  const [nickname, setNickname] = useState(currentNickname)
  const [message, setMessage] = useState('')

  const trimmedNickname = nickname.trim()
  const canSubmit =
    trimmedNickname.length > 0 &&
    trimmedNickname.length <= 64 &&
    trimmedNickname !== currentNickname &&
    !updateNicknameMutation.isPending

  const submit = async (): Promise<boolean> => {
    setMessage('')
    if (!trimmedNickname) {
      setMessage('닉네임을 입력해 주세요.')
      return false
    }
    if (trimmedNickname.length > 64) {
      setMessage('닉네임은 64자 이하로 입력해 주세요.')
      return false
    }
    if (trimmedNickname === currentNickname) {
      setMessage('현재 닉네임과 다른 닉네임을 입력해 주세요.')
      return false
    }

    try {
      await updateNicknameMutation.mutateAsync(trimmedNickname)
      return true
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '닉네임 변경에 실패했습니다.'))
      return false
    }
  }

  return {
    nickname,
    setNickname,
    message,
    canSubmit,
    submit,
  }
}
