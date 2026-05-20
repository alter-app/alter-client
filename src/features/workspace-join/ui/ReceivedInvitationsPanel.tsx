import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptWorkspaceInvitation,
  declineWorkspaceInvitation,
  getMyInvitations,
} from '@/features/workspace-join/api/membership'
import type {
  MyInvitationItemDto,
  MyInvitationsListDto,
} from '@/features/workspace-join/types/membership'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { AuthButton } from '@/shared/ui/common/AuthButton'

type Props = {
  onAccepted: (workspaceName: string) => void
}

const PAGE_SIZE = 20

type InvitationAction = 'ACCEPT' | 'DECLINE'

type InvitationMutationVariables = {
  invitationId: number
  action: InvitationAction
  businessName: string
}

type InvitationMutationContext = {
  previous: MyInvitationsListDto | undefined
}

const pendingInvitationsQueryKey = queryKeys.workspaceMembership.invitations({
  pageSize: PAGE_SIZE,
  status: 'PENDING',
})

function emptyInvitationsListFromCache(pageSize: number): MyInvitationsListDto {
  return {
    page: { cursor: null, pageSize, totalCount: 0 },
    data: [],
  }
}

function formatDateTime(iso: string | null | undefined) {
  if (iso == null || iso === '') return '-'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function normalizeInvitationRows(
  rows: MyInvitationItemDto[] | null | undefined
): MyInvitationItemDto[] {
  if (!Array.isArray(rows)) return []
  return rows.filter(
    (row): row is MyInvitationItemDto =>
      row != null && typeof row.invitationId === 'number'
  )
}

export function ReceivedInvitationsPanel({ onAccepted }: Props) {
  const queryClient = useQueryClient()

  const invitationsQuery = useQuery({
    queryKey: pendingInvitationsQueryKey,
    queryFn: () => getMyInvitations({ pageSize: PAGE_SIZE, status: 'PENDING' }),
  })

  const items = normalizeInvitationRows(invitationsQuery.data?.data)

  const invitationMut = useMutation({
    mutationFn: async ({
      invitationId,
      action,
    }: InvitationMutationVariables) => {
      if (action === 'ACCEPT') {
        await acceptWorkspaceInvitation(invitationId)
      } else {
        await declineWorkspaceInvitation(invitationId)
      }
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: pendingInvitationsQueryKey })

      const previous = queryClient.getQueryData<MyInvitationsListDto>(
        pendingInvitationsQueryKey
      )

      queryClient.setQueryData<MyInvitationsListDto>(
        pendingInvitationsQueryKey,
        old => {
          const base = old ?? emptyInvitationsListFromCache(PAGE_SIZE)
          const currentRows = normalizeInvitationRows(base.data)
          const nextData = currentRows.filter(
            item => item.invitationId !== variables.invitationId
          )
          const prevTotal =
            typeof base.page?.totalCount === 'number'
              ? base.page.totalCount
              : currentRows.length

          return {
            ...base,
            data: nextData,
            page: {
              cursor: base.page?.cursor ?? null,
              pageSize: base.page?.pageSize ?? PAGE_SIZE,
              totalCount: Math.max(0, prevTotal - 1),
            },
          }
        }
      )

      return { previous } satisfies InvitationMutationContext
    },
    onError: (_error, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(pendingInvitationsQueryKey, context.previous)
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.action === 'ACCEPT') {
        onAccepted(variables.businessName)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembership.all,
      })
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })
    },
  })

  const active = invitationMut.variables
  const isListBusy = invitationMut.isPending

  function isActiveRow(invitationId: number) {
    return active?.invitationId === invitationId
  }

  function isActionLoading(invitationId: number, action: InvitationAction) {
    return (
      invitationMut.isPending &&
      active?.invitationId === invitationId &&
      active.action === action
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="typography-body02-regular text-text-70">
        사장님이 등록한 전화번호로 보낸 업장 초대예요. 만료 전에 수락하거나
        거절해 주세요.
      </p>

      {invitationsQuery.isPending ? (
        <p className="typography-body02-regular text-text-70">
          불러오는 중이에요…
        </p>
      ) : null}

      {invitationsQuery.isError ? (
        <>
          <p className="typography-body02-regular text-red-600">
            {getAxiosErrorMessage(
              invitationsQuery.error,
              '초대 목록을 불러오지 못했습니다.'
            )}
          </p>
          <button
            type="button"
            className="typography-body02-semibold text-main underline"
            onClick={() => invitationsQuery.refetch()}
          >
            다시 시도
          </button>
        </>
      ) : null}

      {!invitationsQuery.isPending &&
      !invitationsQuery.isError &&
      items.length === 0 ? (
        <p className="typography-body02-regular text-text-70">
          대기 중인 초대가 없어요. 사장님께 이 번호로 초대를 요청해 주세요.
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {items.map(row => (
          <li
            key={row.invitationId}
            className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-white px-4 py-4"
          >
            <div>
              <p className="typography-body01-semibold text-text-100">
                {row.businessName?.trim() || '업장'}
              </p>
              <p className="mt-1 typography-body02-regular text-text-70">
                초대 일시 {formatDateTime(row.invitedAt)}
              </p>
              <p className="typography-body02-regular text-text-70">
                만료 예정 {formatDateTime(row.expiresAt)}
              </p>
            </div>

            {invitationMut.isError && isActiveRow(row.invitationId) ? (
              <p className="typography-body02-regular text-red-600">
                {getAxiosErrorMessage(
                  invitationMut.error,
                  active?.action === 'ACCEPT'
                    ? '수락 처리에 실패했습니다.'
                    : '거절 처리에 실패했습니다.'
                )}
              </p>
            ) : null}

            <div className="flex gap-2">
              <AuthButton
                type="button"
                className="flex-1"
                disabled={isListBusy}
                onClick={() =>
                  invitationMut.mutate({
                    invitationId: row.invitationId,
                    action: 'ACCEPT',
                    businessName: row.businessName?.trim() || '업장',
                  })
                }
              >
                {isActionLoading(row.invitationId, 'ACCEPT')
                  ? '처리 중…'
                  : '수락'}
              </AuthButton>
              <button
                type="button"
                className="flex-1 rounded-xl border border-line-2 py-3 typography-body02-semibold text-text-90 disabled:opacity-50"
                disabled={isListBusy}
                onClick={() =>
                  invitationMut.mutate({
                    invitationId: row.invitationId,
                    action: 'DECLINE',
                    businessName: row.businessName?.trim() || '업장',
                  })
                }
              >
                {isActionLoading(row.invitationId, 'DECLINE')
                  ? '처리 중…'
                  : '거절'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
