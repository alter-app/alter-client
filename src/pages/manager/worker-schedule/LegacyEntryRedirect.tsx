import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useManagedWorkspacesQuery } from '@/features/manager/home/hooks/useManagedWorkspacesQuery'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'

/**
 * 구 경로 `/manager/worker-schedule` 진입 시 활성 매장·첫 근무자 기준으로 신규 URL로 치환
 */
export function ManagerWorkerScheduleLegacyEntryRedirect() {
  const navigate = useNavigate()
  const { activeWorkspaceId, isLoading: workspacesLoading } =
    useManagedWorkspacesQuery()
  const { workers, isLoading: workersLoading } =
    useWorkspaceWorkersViewModel(activeWorkspaceId)

  useEffect(() => {
    if (workspacesLoading) return
    if (activeWorkspaceId === null) {
      navigate(ROUTES.MANAGER.HOME, { replace: true })
      return
    }
    if (workersLoading) return
    if (workers.length === 0) {
      navigate(ROUTES.MANAGER.HOME, { replace: true })
      return
    }
    navigate(managerWorkerSchedulePath(activeWorkspaceId, workers[0].id), {
      replace: true,
    })
  }, [activeWorkspaceId, navigate, workers, workersLoading, workspacesLoading])

  return null
}
