import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ReceivedInvitationsPanel } from '@/features/workspace-join/ui/ReceivedInvitationsPanel'

type Phase = 'list' | 'done'

export function WorkspaceJoinPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('list')
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
        {phase === 'list' ? (
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                받은 업장 초대
              </h1>
              <p className="typography-body02-regular text-text-70">
                사장님이 내 전화번호로 보낸 초대를 확인하고 수락하면 바로
                근무자로 연결돼요.
              </p>
            </header>
            <ReceivedInvitationsPanel
              onAccepted={name => {
                setDoneSummary(`「${name}」에 합류했어요.`)
                setPhase('done')
              }}
            />
          </>
        ) : null}

        {phase === 'done' && doneSummary ? (
          <>
            <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
              <h1 className="mb-3 typography-headline01 text-text-100">완료</h1>
              <p className="typography-body02-regular text-text-70">
                {doneSummary}
              </p>
            </div>
            <AuthButton
              type="button"
              className="mt-8"
              onClick={() => navigate('/user/workspace')}
            >
              근무 가게 목록 보기
            </AuthButton>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default WorkspaceJoinPage
