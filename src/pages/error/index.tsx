import { useLocation, useNavigate } from 'react-router-dom'
import { ErrorPage } from '@/shared/ui/common/ErrorPage'
import type { ErrorPageLocationState } from './navigation'

export function ErrorPageRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ErrorPageLocationState | null

  return (
    <ErrorPage
      message={state?.message}
      errorCode={state?.errorCode}
      onRetry={() => window.location.reload()}
      onReportIssue={() => navigate('/my/support')}
    />
  )
}
