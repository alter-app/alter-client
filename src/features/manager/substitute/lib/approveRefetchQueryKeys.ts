/** 승인은 성공·실패 모두 실제 근무 배정에 영향을 주므로 요청 목록과 관리자 일정(월간·오늘)을 다시 조회한다. */
export const SUBSTITUTE_APPROVE_REFETCH_QUERY_KEYS = [
  ['substitute', 'list'],
  ['manager', 'schedules'],
] as const
