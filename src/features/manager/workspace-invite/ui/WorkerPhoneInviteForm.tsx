import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendWorkspaceInvitations } from '@/features/manager/workspace-invite/api/workspaceInvitations'
import { getInviteSendErrorMessage } from '@/features/manager/workspace-invite/lib/inviteSendError'
import { formatPhone } from '@/shared/lib/utils/signupValidation'
import {
  isValidInvitePhoneNumber,
  toApiPhoneNumber,
} from '@/shared/lib/phoneValidation'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'

type Props = {
  workspaceId: number
  onSent?: (count: number) => void
}

export function WorkerPhoneInviteForm({ workspaceId, onSent }: Props) {
  const [draft, setDraft] = useState('')
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([])
  const [draftError, setDraftError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const draftValid = isValidInvitePhoneNumber(draft)
  const canSend = phoneNumbers.length > 0

  const sendMut = useMutation({
    mutationFn: async () => {
      const numbers = [...phoneNumbers]
      await sendWorkspaceInvitations(workspaceId, { phoneNumbers: numbers })
      return numbers.length
    },
    onSuccess: async count => {
      setPhoneNumbers([])
      setDraft('')
      setDraftError('')
      setSuccessMessage(
        count === 1
          ? '초대를 보냈어요. 알바생이 앱에서 수락하면 근무자로 연결돼요.'
          : `${count}명에게 초대를 보냈어요. 알바생이 앱에서 수락하면 근무자로 연결돼요.`
      )
      onSent?.(count)
    },
    onError: () => {
      setSuccessMessage('')
    },
  })

  function clearSendFeedback() {
    setSuccessMessage('')
    sendMut.reset()
  }

  function addDraftToList() {
    clearSendFeedback()

    if (!draftValid) {
      setDraftError('휴대폰 번호 10~11자리를 입력해 주세요.')
      return
    }

    const normalized = toApiPhoneNumber(draft)
    if (phoneNumbers.includes(normalized)) {
      setDraftError('이미 추가한 번호예요.')
      return
    }

    setPhoneNumbers(prev => [...prev, normalized])
    setDraft('')
    setDraftError('')
  }

  function handleAddPhoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    addDraftToList()
  }

  function removePhone(normalized: string) {
    clearSendFeedback()
    setPhoneNumbers(prev => prev.filter(n => n !== normalized))
  }

  function submit() {
    if (!canSend || sendMut.isPending) return
    clearSendFeedback()
    sendMut.mutate()
  }

  const sendButtonLabel = sendMut.isPending
    ? '보내는 중…'
    : canSend
      ? `${phoneNumbers.length}명 초대 보내기`
      : '초대 보내기'

  return (
    <div className="flex flex-col gap-4">
      <p className="typography-body02-regular text-text-70">
        번호를 추가한 뒤 한 번에 보내요. 하나라도 발송할 수 없으면 전체가
        취소됩니다(미가입·이미 근무 중·초대 대기 중).
      </p>

      <form className="flex flex-col gap-2" onSubmit={handleAddPhoneSubmit}>
        <div className="flex gap-2">
          <div className="flex-1">
            <AuthInput
              type="tel"
              maxLength={13}
              placeholder="휴대폰 번호 (10~11자리)"
              value={draft}
              onChange={e => {
                setDraft(formatPhone(e.target.value))
                setDraftError('')
                clearSendFeedback()
              }}
              autoComplete="tel"
            />
          </div>
          <button
            type="submit"
            className="min-w-[72px] shrink-0 rounded-xl border border-line-2 bg-white px-3 typography-body02-semibold text-text-90 disabled:opacity-45"
            disabled={!draftValid}
          >
            추가
          </button>
        </div>

        {draftError ? (
          <p className="typography-body02-regular text-red-600">{draftError}</p>
        ) : null}
      </form>

      {phoneNumbers.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {phoneNumbers.map(normalized => (
            <li
              key={normalized}
              className="flex items-center justify-between rounded-xl border border-line-2 bg-white px-4 py-3"
            >
              <span className="typography-body02-semibold text-text-100">
                {formatPhone(normalized)}
              </span>
              <button
                type="button"
                className="typography-body02-regular text-text-70 underline"
                onClick={() => removePhone(normalized)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="typography-body02-regular text-text-70">
          초대할 번호를 추가해 주세요.
        </p>
      )}

      {sendMut.isError ? (
        <p className="typography-body02-regular text-red-600 whitespace-pre-line">
          {getInviteSendErrorMessage(sendMut.error)}
        </p>
      ) : null}

      {successMessage ? (
        <p className="typography-body02-regular text-main">{successMessage}</p>
      ) : null}

      <AuthButton
        type="button"
        disabled={!canSend || sendMut.isPending}
        onClick={() => submit()}
      >
        {sendButtonLabel}
      </AuthButton>

      {phoneNumbers.length === 0 ? (
        <p className="typography-body02-regular text-text-70">
          알바생이 회원가입 시 인증한 번호와 같아야 초대를 받을 수 있어요.
        </p>
      ) : null}
    </div>
  )
}
