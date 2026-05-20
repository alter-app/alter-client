import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendWorkspaceInvitation } from '@/features/manager/workspace-invite/api/workspaceInvitations'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { formatPhone } from '@/shared/lib/utils/signupValidation'
import {
  isCompleteKoreanMobilePhone,
  toApiPhoneNumber,
} from '@/shared/lib/phoneValidation'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'

type Props = {
  workspaceId: number
  onSent?: () => void
}

export function WorkerPhoneInviteForm({ workspaceId, onSent }: Props) {
  const queryClient = useQueryClient()
  const [phone, setPhone] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const phoneValid = isCompleteKoreanMobilePhone(phone)

  const sendMut = useMutation({
    mutationFn: () =>
      sendWorkspaceInvitation(workspaceId, {
        phoneNumber: toApiPhoneNumber(phone),
      }),
    onSuccess: async () => {
      setPhone('')
      setSuccessMessage(
        '초대를 보냈어요. 알바생이 앱에서 수락하면 근무자로 연결돼요.'
      )
      await queryClient.invalidateQueries({
        queryKey: queryKeys.managerWorkspaceInvitations.all(workspaceId),
      })
      onSent?.()
    },
    onError: () => {
      setSuccessMessage('')
    },
  })

  function submit() {
    if (!phoneValid || sendMut.isPending) return
    setSuccessMessage('')
    sendMut.mutate()
  }

  return (
    <div className="flex flex-col gap-3">
      <AuthInput
        type="tel"
        maxLength={13}
        placeholder="알바생 휴대폰 번호 (010-0000-0000)"
        value={phone}
        onChange={e => {
          setPhone(formatPhone(e.target.value))
          setSuccessMessage('')
          sendMut.reset()
        }}
        autoComplete="tel"
        onKeyDown={e => {
          if (e.key === 'Enter') submit()
        }}
      />

      {sendMut.isError ? (
        <p className="typography-body02-regular text-red-600">
          {getAxiosErrorMessage(
            sendMut.error,
            '초대를 보내지 못했습니다. 번호를 확인해 주세요.'
          )}
        </p>
      ) : null}

      {successMessage ? (
        <p className="typography-body02-regular text-main">{successMessage}</p>
      ) : null}

      <AuthButton
        type="button"
        disabled={!phoneValid || sendMut.isPending}
        onClick={() => submit()}
      >
        {sendMut.isPending ? '보내는 중…' : '초대 보내기'}
      </AuthButton>

      <p className="typography-body02-regular text-text-70">
        알바생이 회원가입 시 인증한 휴대폰 번호와 같아야 초대를 받을 수 있어요.
      </p>
    </div>
  )
}
