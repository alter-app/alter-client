/** 99를 넘는 미읽음은 '99+'로 축약합니다 */
export const MAX_VISIBLE_UNREAD_COUNT = 99

export function formatUnreadCount(count: number): string {
  return count > MAX_VISIBLE_UNREAD_COUNT
    ? `${MAX_VISIBLE_UNREAD_COUNT}+`
    : String(count)
}
