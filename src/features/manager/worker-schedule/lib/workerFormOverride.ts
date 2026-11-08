/**
 * 근무자별로 사용자가 고친 폼. 서버 데이터가 다시 조회돼도 유지되며(저장 실패 후 입력 유지),
 * 다른 근무자의 수정은 무시한다. 저장 성공·근무자 전환 시 호출자가 비운다.
 */
export type WorkerFormOverride<T> = { workerId: number; form: T } | null

export function selectWorkerForm<T>(
  override: WorkerFormOverride<T>,
  workerId: number,
  serverForm: T
): T {
  return override?.workerId === workerId ? override.form : serverForm
}

/** 서버 데이터를 불러오는 중에는 기본값 위에 수정이 쌓이지 않도록 수정을 무시하고 null을 돌려준다. */
export function patchWorkerForm<T>(
  current: T,
  workerId: number,
  patch: Partial<T>,
  loading: boolean
): WorkerFormOverride<T> {
  if (loading) return null
  return { workerId, form: { ...current, ...patch } }
}
