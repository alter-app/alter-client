import type { WorkspaceWorkerItem } from '@/features/user/home/workspace/types/workspaceMembers'
import { LoadMoreButton } from './LoadMoreButton'

type Props = {
  workers: WorkspaceWorkerItem[]
  hasMore: boolean
  onLoadMore: () => void
}

export function WorkersSection({ workers, hasMore, onLoadMore }: Props) {
  if (workers.length === 0) return null

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
      <h2 className="font-pretendard font-semibold text-4 text-text-100 mb-3">
        근무자
      </h2>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {workers.map(worker => (
          <li
            key={worker.id}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-light"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-pretendard font-semibold text-3 text-text-100">
                {worker.name}
              </span>
              <span className="font-pretendard text-2 text-text-70">
                {worker.positionEmoji}{' '}
                {worker.positionDescription || worker.positionType}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-pretendard text-[11px] text-text-50">
                입사일 {worker.employedAt}
              </span>
              {worker.nextShiftDateTime && (
                <span className="font-pretendard text-[11px] text-primary-600">
                  다음 근무 예정: {worker.nextShiftDateTime}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {hasMore && <LoadMoreButton onClick={onLoadMore} />}
    </section>
  )
}

export default WorkersSection
