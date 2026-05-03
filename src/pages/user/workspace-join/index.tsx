import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ReceivedInvitationsPanel } from '@/features/workspace-join/ui/ReceivedInvitationsPanel'
import { SentJoinRequestsPanel } from '@/features/workspace-join/ui/SentJoinRequestsPanel'
import { StoreSearchJoinPanel } from '@/features/workspace-join/ui/StoreSearchJoinPanel'
import type { DiscoverableStoreRow } from '@/features/workspace-join/types'

type Phase = 'choose' | 'invitations' | 'search' | 'sent' | 'done'

export function WorkspaceJoinPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('choose')
  const [doneSummary, setDoneSummary] = useState<string | null>(null)

  const reset = () => {
    setPhase('choose')
    setDoneSummary(null)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="업장 합류"
        onBackClick={() => {
          if (phase === 'choose') {
            navigate(-1)
            return
          }
          if (phase === 'done') {
            navigate('/user/workspace')
            return
          }
          reset()
        }}
      />

      <div className="mx-auto w-full max-w-[400px] flex-1 px-4 pb-10 pt-4">
        {phase === 'choose' ?
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                업장에 합류하는 방법
              </h1>
              <p className="typography-body02-regular text-text-70">
                받은 업장 초대를 수락하거나, 매장 검색으로 합류를 신청할 수
                있어요.
              </p>
            </header>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="flex flex-col rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-line-2"
                onClick={() => setPhase('invitations')}
              >
                <span className="typography-headline03 text-main">
                  1 · 받은 업장 초대
                </span>
                <span className="mt-2 typography-body02-regular text-text-70">
                  사장님이 보낸 초대를 수락하거나 거절해요.
                </span>
              </button>

              <button
                type="button"
                className="flex flex-col rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-line-2"
                onClick={() => setPhase('search')}
              >
                <span className="typography-headline03 text-text-100">
                  2 · 업장 검색 후 가입 신청
                </span>
                <span className="typography-body02-regular text-text-70">
                  신청 후 사장님이 승인하면 근무 목록에 반영돼요.
                </span>
              </button>

              <button
                type="button"
                className="flex flex-col rounded-2xl bg-white px-5 py-5 text-left shadow-sm ring-1 ring-line-2"
                onClick={() => setPhase('sent')}
              >
                <span className="typography-headline03 text-text-100">
                  3 · 내가 보낸 합류 요청
                </span>
                <span className="typography-body02-regular text-text-70">
                  검색으로 보낸 요청 상태를 확인할 수 있어요.
                </span>
              </button>
            </div>
          </>
        : null}

        {phase === 'invitations' ?
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                받은 업장 초대
              </h1>
            </header>
            <ReceivedInvitationsPanel
              onAccepted={name => {
                setDoneSummary(`「${name}」 업장 초대를 수락했어요.`)
                setPhase('done')
              }}
            />
          </>
        : null}

        {phase === 'search' ?
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                업장 검색
              </h1>
            </header>
            <StoreSearchJoinPanel
              onApplied={(store: DiscoverableStoreRow) => {
                setDoneSummary(
                  `「${store.displayName}」에 합류를 요청했어요. 사장님 승인을 기다려 주세요.`
                )
                setPhase('done')
              }}
            />
          </>
        : null}

        {phase === 'sent' ?
          <>
            <header className="mb-8">
              <h1 className="mb-2 typography-headline01 text-text-100">
                내가 보낸 합류 요청
              </h1>
            </header>
            <SentJoinRequestsPanel />
          </>
        : null}

        {phase === 'done' && doneSummary ?
          <>
            <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
              <h1 className="mb-3 typography-headline01 text-text-100">
                완료
              </h1>
              <p className="typography-body02-regular text-text-70">
                {doneSummary}
              </p>
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
