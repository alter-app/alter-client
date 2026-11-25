export function workerIdFromCandidateKey(key: string): number | undefined {
  if (!key.startsWith('ew-')) return undefined
  const id = Number(key.slice(3))
  return Number.isFinite(id) ? id : undefined
}

/**
 * 다시 조회한 후보 목록에 없는 근무자(서버가 충돌로 뺀 사용자 등)의 선택을 해제한다.
 * 바뀐 것이 없으면 같은 Set을 돌려준다.
 */
export function retainAvailableCandidateKeys(
  selectedKeys: Set<string>,
  availableWorkerIds: readonly number[]
): Set<string> {
  const available = new Set(availableWorkerIds)
  const next = new Set(
    [...selectedKeys].filter(key => {
      const workerId = workerIdFromCandidateKey(key)
      return workerId != null && available.has(workerId)
    })
  )
  return next.size === selectedKeys.size ? selectedKeys : next
}
