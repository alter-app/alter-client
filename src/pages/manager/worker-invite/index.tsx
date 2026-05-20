import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import { useWorkspaceDetailQuery } from '@/features/manager/home/hooks/useWorkspaceDetailQuery'
import { WorkerPhoneInviteForm } from '@/features/manager/workspace-invite/ui/WorkerPhoneInviteForm'
import { ROUTES } from '@/shared/constants/routes'

export function ManagerWorkerInvitePage() {
  const navigate = useNavigate()
  const { workspaces, activeWorkspaceId } = useManagedWorkspacesQuery()
  const { detail } = useWorkspaceDetailQuery(activeWorkspaceId)

  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar
          variant="detail"
          title="근무자 초대"
          onBackClick={() => navigate(ROUTES.MANAGER.HOME)}
        />
        <div className="mx-auto flex max-w-[400px] flex-1 flex-col justify-center px-4">
          <p className="text-center typography-body02-regular text-text-70">
            먼저 업장을 등록해 주세요.
          </p>
        </div>
      </div>
    )
  }

  if (activeWorkspaceId === null) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar
          variant="detail"
          title="근무자 초대"
          onBackClick={() => navigate(ROUTES.MANAGER.HOME)}
        />
        <div className="mx-auto flex max-w-[400px] flex-1 items-center justify-center px-4">
          <p className="typography-body02-regular text-text-70">로딩 중…</p>
        </div>
      </div>
    )
  }

  const storeName = detail?.businessName ?? '선택한 업장'

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="근무자 초대"
        onBackClick={() => navigate(ROUTES.MANAGER.HOME)}
      />

      <div className="mx-auto w-full max-w-[400px] flex-1 px-4 pb-10 pt-4">
        <header className="mb-8">
          <h1 className="mb-2 typography-headline01 text-text-100">
            전화번호로 초대
          </h1>
          <p className="typography-body02-regular text-text-70">
            <span className="font-semibold text-text-90">{storeName}</span>에
            합류할 알바생 휴대폰 번호를 추가한 뒤 한 번에 초대해 주세요. 가입·
            인증한 번호와 일치해야 초대를 받을 수 있어요.
          </p>
        </header>

        <WorkerPhoneInviteForm workspaceId={activeWorkspaceId} />
      </div>
    </div>
  )
}

export default ManagerWorkerInvitePage
