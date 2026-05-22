import { useMemo, useState } from 'react'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useNotifications } from '@/features/notification/hooks/useNotifications'
import {
  NOTIFICATION_TYPE,
  type NotificationType,
} from '@/features/notification/types/notificationType'
import type { NotificationItemProps } from '@/shared/ui/notification/NotificationItem'
import type { NotificationDto } from '@/features/notification/types'

function formatTimeAgo(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

function mapDto(dto: NotificationDto): Omit<NotificationItemProps, 'onDelete'> {
  return {
    id: dto.id,
    isRead: false,
    category: dto.title,
    timeAgo: formatTimeAgo(dto.createdAt),
    message: dto.body,
  }
}

export function useNotificationViewModel() {
  const [selectedType, setSelectedType] = useState<NotificationType>(
    NOTIFICATION_TYPE.GENERAL
  )
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set())

  const scope = useAuthStore(s => s.scope)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(scope, selectedType)

  const currentItems: NotificationItemProps[] = useMemo(() => {
    const dtos =
      data?.pages
        .flatMap(page => page.data ?? [])
        .filter(dto => !deletedIds.has(dto.id)) ?? []

    return dtos.map(dto => ({
      ...mapDto(dto),
      onDelete: () => setDeletedIds(prev => new Set([...prev, dto.id])),
    }))
  }, [data, deletedIds])

  return {
    selectedType,
    setSelectedType,
    currentItems,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
  }
}
