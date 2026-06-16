/** 신청 내역 목록 로딩 스켈레톤 — 카드 3개 */
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-line-1 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="h-[18px] w-[120px] rounded-md bg-bg-dark" />
        <span className="h-7 w-16 rounded-full bg-bg-dark" />
      </div>
      <span className="mt-3 block h-[14px] w-4/5 rounded-md bg-bg-dark" />
      <span className="mt-2 block h-3 w-2/5 rounded-md bg-bg-dark" />
    </div>
  )
}

export function RequestListSkeleton() {
  return (
    <ul className="flex animate-pulse flex-col gap-3" aria-hidden>
      {[0, 1, 2].map(i => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  )
}
