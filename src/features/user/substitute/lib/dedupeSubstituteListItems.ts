/**
 * 커서 페이지를 받는 사이 목록이 바뀌어 같은 id가 다음 페이지에 다시 오면,
 * 처음 나온 위치는 유지하고 값은 나중에 받은(더 최신인) 항목으로 바꾼다.
 */
export function dedupeSubstituteListItems<T extends { id: number }>(
  items: readonly T[]
): T[] {
  return [...new Map(items.map(item => [item.id, item])).values()]
}
