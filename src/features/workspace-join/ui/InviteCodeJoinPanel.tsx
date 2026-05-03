import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { redeemInviteByCode } from '@/features/workspace-join/api/inviteCodeRedeem'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

type Props = {
  onSuccess: (workspaceDisplayName: string) => void
}

export function InviteCodeJoinPanel({ onSuccess }: Props) {
  const queryClient = useQueryClient()
  const [code, setCode] = useState('')

  const trimmed = code.trim().toUpperCase().replace(/\s+/g, '')
  const validLength = trimmed.length >= 4

  const mut = useMutation({
    mutationFn: () => redeemInviteByCode(trimmed),
    onSuccess: async name => {
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })
      onSuccess(name)
    },
  })

  function submit() {
    if (!validLength || mut.isPending) return
    mut.reset()
    mut.mutate()
  }

  return (
    <div className="flex flex-col gap-2">
      <AuthInput
        type="text"
        placeholder="초대 코드 입력"
        value={code}
        onChange={e =>
          setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))
        }
        spellCheck={false}
        autoCapitalize="characters"
        onKeyDown={e => {
          if (e.key === 'Enter') submit()
        }}
      />

      {mut.isError ? (
        <p className="typography-body02-regular text-red-600">
          {getAxiosErrorMessage(
            mut.error,
            '초대 코드를 처리하지 못했습니다. 코드를 확인해 주세요.'
          )}
        </p>
      ) : null}

      <AuthButton
        type="button"
        disabled={!validLength || mut.isPending}
        style={{
          opacity: validLength && !mut.isPending ? 1 : 0.45,
          width: '100%',
          cursor: validLength && !mut.isPending ? 'pointer' : 'not-allowed',
        }}
        onClick={() => submit()}
      >
        {mut.isPending ? '확인 중...' : '코드 확인'}
      </AuthButton>
    </div>
  )
}
