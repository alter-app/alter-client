import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import {
  useWorkspacesViewModel,
  useWorkspaceScheduleViewModel,
} from '@/features/user'
import { ROUTES } from '@/shared/constants/routes'
import { SubstituteRequestModalFlow } from '@/pages/user/workspace-detail/components/SubstituteRequestModalFlow'

export function SubstituteRequestPage() {
  const navigate = useNavigate()
  const { workspaces, isLoading, isError } = useWorkspacesViewModel()
  const [pickedWorkspaceId, setPickedWorkspaceId] = useState<number | null>(
    null
  )
  const [flowActive, setFlowActive] = useState(false)
  const [singleFlowDismissed, setSingleFlowDismissed] = useState(false)
  const [flowSession, setFlowSession] = useState(0)

  const isSingleWorkspace = !isLoading && workspaces.length === 1
  const soleWorkspaceId = isSingleWorkspace ? workspaces[0]!.workspaceId : null

  const workspaceId = pickedWorkspaceId ?? soleWorkspaceId

  const selectedWorkspace = useMemo(
    () => workspaces.find(w => w.workspaceId === workspaceId),
    [workspaces, workspaceId]
  )

  const { baseDate, calendarData } = useWorkspaceScheduleViewModel(
    workspaceId ?? 0
  )

  const storeDisplayName =
    selectedWorkspace?.businessName?.trim() ?? '근무 업장'

  const showFlow =
    workspaceId != null &&
    (isSingleWorkspace ? !singleFlowDismissed : flowActive)

  const startFlow = (workspaceIdToUse: number) => {
    if (!isSingleWorkspace) {
      setPickedWorkspaceId(workspaceIdToUse)
    }
    setSingleFlowDismissed(false)
    setFlowActive(true)
    setFlowSession(s => s + 1)
  }

  const closeFlow = () => {
    setFlowActive(false)
    setSingleFlowDismissed(true)
    if (!isSingleWorkspace) {
      setPickedWorkspaceId(null)
    }
  }

  const showWorkspacePicker =
    !isLoading && workspaces.length > 1 && pickedWorkspaceId == null

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="대타 요청"
        onBackClick={() => navigate(-1)}
      />

      <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col gap-4 px-4 py-4">
        {isLoading ? (
          <p className="py-10 text-center typography-body02-regular text-text-70">
            로딩 중...
          </p>
        ) : isError ? (
          <p className="py-10 text-center typography-body02-regular text-text-70">
            데이터를 불러오는 데 실패했습니다.
          </p>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="typography-body02-regular text-text-70">
              근무중인 가게가 없습니다.
            </p>
            <button
              type="button"
              className="rounded-xl bg-main px-5 py-3 typography-body02-semibold text-white"
              onClick={() => navigate(ROUTES.USER.WORKSPACE_JOIN)}
            >
              업장 합류하기
            </button>
          </div>
        ) : showWorkspacePicker ? (
          <>
            <p className="px-1 typography-body02-regular text-text-70">
              대타를 요청할 가게를 선택해주세요.
            </p>
            <div className="flex flex-col gap-2">
              {workspaces.map(store => (
                <button
                  key={store.workspaceId}
                  type="button"
                  className="rounded-2xl border border-line-2 bg-white px-4 py-4 text-left transition-colors active:bg-bg-dark"
                  onClick={() => startFlow(store.workspaceId)}
                >
                  <span className="typography-body01-semibold text-text-100">
                    {store.businessName}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : selectedWorkspace != null && !showFlow ? (
          <div className="flex flex-col gap-4">
            <p className="px-1 typography-body02-semibold text-text-100">
              {storeDisplayName}
            </p>
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
              onClick={() => startFlow(selectedWorkspace.workspaceId)}
            >
              대타 요청하기
            </button>
          </div>
        ) : null}
      </div>

      {showFlow && workspaceId != null ? (
        <SubstituteRequestModalFlow
          key={flowSession}
          onClose={closeFlow}
          storeName={storeDisplayName}
          calendarData={calendarData}
          initialMonth={baseDate}
          workspaceId={workspaceId}
        />
      ) : null}
    </div>
  )
}
