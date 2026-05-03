import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { InviteCodeJoinPanel } from '@/features/workspace-join/ui/InviteCodeJoinPanel'

type Phase = 'code' | 'done'

export function WorkspaceJoinPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('code')
  const [doneSummary, setDoneSummary] = useState<string | null>(null)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="업장 합류"
        onBackClick={() => {
          if (phase === 'done') {
            navigate('/user/workspace')
            return
          }
          navigate(-1)
        }}
      />

      <div className="mx-auto w-full max-w-[400px] flex-1 px-4 pb-10 pt-4">
        {phase === 'code' ?
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                초대 코드로 합류
              </h1>
              <p className="typography-body02-regular text-text-70">
              사장님이 알려 준 초대 코드를 입력해 주세요.<br/> 유효하면 바로 업장 근무자로 연결돼요.
              </p>
            </header>
            <InviteCodeJoinPanel
              onSuccess={name => {
                setDoneSummary(`「${name}」에 초대를 수락했어요.`)
                setPhase('done')
              }}
            />
          </>
        : null}

        {phase === 'done' && doneSummary ?
          <>
            <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
              <h1 className="mb-3 typography-headline01 text-text-100">
                완료
              </h1>
              <p className="typography-body02-regular text-text-70">{doneSummary}</p>
            </div>
            <AuthButton
              type="button"
              className="mt-8"
              style={{ width: '100%' }}
              onClick={() => navigate('/user/workspace')}
            >
              근무 가게 목록 보기
            </AuthButton>
          </>
        : null}
      </div>
    </div>
  )
}

export default WorkspaceJoinPage
