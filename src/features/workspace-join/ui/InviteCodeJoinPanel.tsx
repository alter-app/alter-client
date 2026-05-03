import { useState } from 'react'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { redeemWorkspaceInvite } from '@/features/workspace-join/api/workspaceJoin'

type Props = {
  onSuccess: (workspaceName: string) => void
}

export function InviteCodeJoinPanel({ onSuccess }: Props) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = code.trim().toUpperCase()
  const validLength = trimmed.length >= 4

  const submit = async () => {
    if (!validLength || busy) return
    setError(null)
    setBusy(true)
    try {
      const { workspaceName } = await redeemWorkspaceInvite(trimmed)
      onSuccess(workspaceName)
    } catch (e) {
      setError(e instanceof Error ? e.message : '처리하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-4 typography-body02-regular text-text-70">
          사장님이 공유한 초대 코드를 입력하면 바로 업장 근무자로 초대 처리돼요.
        </p>
        <AuthInput
          type="text"
          placeholder="예: ALTER-ABC12"
          value={code}
          onChange={e =>
            setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))
          }
          autoCapitalize="characters"
          spellCheck={false}
        />
        {error ? (
          <p className="mt-3 typography-body02-regular text-red-600">{error}</p>
        ) : null}
      </div>
      <AuthButton
        type="button"
        disabled={!validLength || busy}
        style={{
          opacity: validLength && !busy ? 1 : 0.45,
          width: '100%',
          cursor: validLength && !busy ? 'pointer' : 'not-allowed',
        }}
        onClick={() => submit()}
      >
        {busy ? '확인 중...' : '코드 확인'}
      </AuthButton>
    </div>
  )
}
