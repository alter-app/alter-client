import type { WorkspaceManagerDto } from '@/shared/api/workspaceMembers'
import { LoadMoreButton } from './LoadMoreButton'

type Props = {
  managers: WorkspaceManagerDto[]
  hasMore: boolean
  onLoadMore: () => void
}

export function ManagersSection(props: Props) {
  const { managers, hasMore, onLoadMore } = props

  if (managers.length === 0) return null

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
      <h2 className="font-pretendard font-semibold text-4 text-text-100 mb-3">
        점주 / 매니저
      </h2>
      <ul className="list-none p-0 m-0 flex flex-col gap-3">
        {managers.map(manager => (
          <li
            key={manager.id}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-light"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-pretendard font-semibold text-3 text-text-100">
                {manager.manager.name}
              </span>
              <span className="font-pretendard text-2 text-text-70">
                {manager.position.emoji}{' '}
                {manager.position.description || manager.position.type}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && <LoadMoreButton onClick={onLoadMore} />}
    </section>
  )
}

export default ManagersSection

