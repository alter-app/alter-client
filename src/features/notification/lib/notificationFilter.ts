import {
  NOTIFICATION_TYPE,
  type NotificationType,
} from '@/features/notification/types/notificationType'

export const NOTIFICATION_FILTER = {
  ALL: 'ALL',
  GENERAL: 'GENERAL',
  SCHEDULE: 'SCHEDULE',
} as const

export type NotificationFilter =
  (typeof NOTIFICATION_FILTER)[keyof typeof NOTIFICATION_FILTER]

export const NOTIFICATION_FILTERS: readonly NotificationFilter[] = [
  NOTIFICATION_FILTER.ALL,
  NOTIFICATION_FILTER.GENERAL,
  NOTIFICATION_FILTER.SCHEDULE,
]

const FILTER_TO_TYPE: Record<NotificationFilter, NotificationType | undefined> =
  {
    ALL: undefined,
    GENERAL: NOTIFICATION_TYPE.GENERAL,
    SCHEDULE: NOTIFICATION_TYPE.SCHEDULE,
  }

/** 목록 API의 `type` 값. 전체는 `undefined`라 요청에서 `type`이 빠지고, 서버는 모든 유형을 돌려준다. */
export function toNotificationTypeParam(
  filter: NotificationFilter
): NotificationType | undefined {
  return FILTER_TO_TYPE[filter]
}
