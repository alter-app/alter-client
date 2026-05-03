import { useQuery } from '@tanstack/react-query'
import {
  getAxiosErrorMessage,
  getMyJoinRequests,
} from '@/features/workspace-join/api/membership'
import type { WorkspaceJoinRequestStatus } from '@/features/workspace-join/types/membership'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 20

const STATUS_LABEL: Record<WorkspaceJoinRequestStatus, string> = {
  PENDING: '승인 대기',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
}

export function SentJoinRequestsPanel() {
  const q = useQuery({
    queryKey: queryKeys.workspaceMembership.joinRequests({
      pageSize: PAGE_SIZE,
    }),
    queryFn: () => getMyJoinRequests({ pageSize: PAGE_SIZE }),
  })

  const items = q.data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <p className="typography-body02-regular text-text-70">
        매장 검색으로 보낸 합류 요청과 처리 상태예요.
      </p>

      {q.isPending ?
        <p className="typography-body02-regular text-text-70">
          불러오는 중이에요…
        </p>
      : null}

      {q.isError ?
        <>
          <p className="typography-body02-regular text-red-600">
            {getAxiosErrorMessage(q.error, '요청 목록을 불러오지 못했습니다.')}
          </p>
          <button
            type="button"
            className="typography-body02-semibold text-main underline"
            onClick={() => q.refetch()}
          >
            다시 시도
          </button>
        </>
      : null}

      {!q.isPending && !q.isError && items.length === 0 ?
        <p className="typography-body02-regular text-text-70">
          아직 보낸 합류 요청이 없어요.
        </p>
      : null}

      <ul className="flex flex-col gap-2">
        {items.map(row => (
          <li
            key={row.joinRequestId}
            className="rounded-2xl border border-line-2 bg-white px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="typography-body01-semibold text-text-100">
                {row.businessName}
              </p>
              <span className="shrink-0 rounded-lg bg-main/15 px-2 py-1 typography-body02-semibold text-main">
                {STATUS_LABEL[row.status]}
              </span>
            </div>
            <p className="mt-2 typography-body02-regular text-text-70">
              신청 일시{' '}
              {new Date(row.requestedAt).toLocaleString('ko-KR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
