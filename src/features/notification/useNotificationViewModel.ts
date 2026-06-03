import { useMemo, useState } from 'react'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useNotifications } from '@/features/notification/hooks/useNotifications'
import { useMarkNotificationRead } from '@/features/notification/hooks/useMarkNotificationRead'
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
    isRead: dto.read,
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
  const [readIds, setReadIds] = useState<Set<number>>(new Set())

  const scope = useAuthStore(s => s.scope)
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(scope, selectedType)

  const { mutate: markRead } = useMarkNotificationRead(scope)

  const currentItems: NotificationItemProps[] = useMemo(() => {
    const dtos =
      data?.pages
        .flatMap(page => page.data ?? [])
        .filter(dto => !deletedIds.has(dto.id)) ?? []

    return dtos.map(dto => ({
      ...mapDto(dto),
      isRead: dto.read || readIds.has(dto.id),
      onDelete: () => setDeletedIds(prev => new Set([...prev, dto.id])),
      onClick: () => {
        if (!dto.read && !readIds.has(dto.id)) {
          setReadIds(prev => new Set([...prev, dto.id]))
          markRead(dto.id)
        }
      },
    }))
  }, [data, deletedIds, readIds, markRead])

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
