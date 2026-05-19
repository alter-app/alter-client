import { useNavigate } from 'react-router-dom'
import { ErrorPage } from '@/shared/ui/common/ErrorPage'

export function ErrorPageRoute() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      onRetry={() => window.location.reload()}
      onReportIssue={() => navigate('/my/support')}
    />
  )
}
