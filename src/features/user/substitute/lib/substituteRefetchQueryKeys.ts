/** 받은 요청 수락·거절은 성공·실패 모두 받은 목록의 항목·상태·totalCount를 바꿀 수 있어 목록 전체를 다시 조회한다. */
export const USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS = [
  ['userSubstitute', 'list'],
] as const

/**
 * 대타 요청 생성은 성공·실패 모두 후보(서버가 충돌 사용자를 뺀다)와 내 교환 가능 일정, 대타 목록을 바꿀 수 있다.
 * `workspaceId`가 없으면(레거시 달력 데이터 사용) 내 교환 가능 일정 조회가 없으므로 뺀다.
 */
export function buildSubstituteCreateRefetchQueryKeys(
  scheduleId: number,
  workspaceId?: number
): ReadonlyArray<readonly unknown[]> {
  return [
    ['workspace', 'exchangeableWorkers', scheduleId],
    ...(workspaceId != null && workspaceId > 0
      ? [['workspace', 'exchangeableSchedules', workspaceId]]
      : []),
    ['userSubstitute', 'list'],
  ]
}
