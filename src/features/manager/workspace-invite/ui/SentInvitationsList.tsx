import { useQuery } from '@tanstack/react-query'
import { getWorkspaceInvitations } from '@/features/manager/workspace-invite/api/workspaceInvitations'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { formatPhone } from '@/shared/lib/utils/signupValidation'
import type { WorkspaceInvitationStatus } from '@/features/workspace-join/types/membership'

type Props = {
  workspaceId: number
}

const PAGE_SIZE = 20

const STATUS_LABEL: Record<WorkspaceInvitationStatus, string> = {
  PENDING: '대기',
  ACCEPTED: '수락',
  DECLINED: '거절',
  EXPIRED: '만료',
}

function formatPhoneDisplay(digits: string) {
  const n = digits.replace(/\D/g, '')
  if (n.length <= 3) return n
  if (n.length <= 7) return formatPhone(n)
  return formatPhone(n)
}

export function SentInvitationsList({ workspaceId }: Props) {
  const listQuery = useQuery({
    queryKey: queryKeys.managerWorkspaceInvitations.list(workspaceId, {
      pageSize: PAGE_SIZE,
      status: 'PENDING',
    }),
    queryFn: () =>
      getWorkspaceInvitations(workspaceId, {
        pageSize: PAGE_SIZE,
        status: 'PENDING',
      }),
  })

  const items = listQuery.data?.data ?? []

  if (listQuery.isPending) {
    return (
      <p className="typography-body02-regular text-text-70">
        보낸 초대를 불러오는 중…
      </p>
    )
  }

  if (listQuery.isError) {
    return (
      <p className="typography-body02-regular text-text-70">
        {getAxiosErrorMessage(
          listQuery.error,
          '보낸 초대 목록을 불러오지 못했습니다.'
        )}
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="typography-body02-regular text-text-70">
        대기 중인 초대가 없어요.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map(row => (
        <li
          key={row.invitationId}
          className="flex items-center justify-between rounded-xl border border-line-2 bg-white px-4 py-3"
        >
          <div>
            <p className="typography-body02-semibold text-text-100">
              {row.inviteeName?.trim() || formatPhoneDisplay(row.phoneNumber)}
            </p>
            {row.inviteeName?.trim() ? (
              <p className="typography-body02-regular text-text-70">
                {formatPhoneDisplay(row.phoneNumber)}
              </p>
            ) : null}
          </div>
          <span className="rounded-full bg-bg-dark px-2 py-0.5 typography-body02-regular text-text-70">
            {STATUS_LABEL[row.status] ?? row.status}
          </span>
        </li>
      ))}
    </ul>
  )
}
