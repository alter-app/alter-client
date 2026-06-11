import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/shared/constants/routes'
import { useNotificationUnreadCount } from './useNotificationUnreadCount'

export function useNavbarNotificationProps() {
  const navigate = useNavigate()
  const scope = useAuthStore(s => s.scope)
  const { data } = useNotificationUnreadCount(scope)

  return {
    hasUnread: data?.hasUnread ?? false,
    onNotificationClick: () => navigate(ROUTES.NOTIFICATIONS),
  }
}
