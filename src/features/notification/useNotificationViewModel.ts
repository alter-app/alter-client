import { useState } from 'react'
import type { NotificationItemProps } from '@/shared/ui/notification/NotificationItem'

export type NotificationTab = 'substitute' | 'reputation'

// TODO: 로그인 계정 타입에 따라 다른 API 호출
export function useNotificationViewModel() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('substitute')

  const substituteItems: NotificationItemProps[] = []
  const reputationItems: NotificationItemProps[] = []

  const currentItems =
    activeTab === 'substitute' ? substituteItems : reputationItems

  const hasUnreadSubstitute = substituteItems.some(item => !item.isRead)
  const hasUnreadReputation = reputationItems.some(item => !item.isRead)

  return {
    activeTab,
    setActiveTab,
    currentItems,
    hasUnreadSubstitute,
    hasUnreadReputation,
  }
}
