import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  acceptWorkspaceInvitation,
  declineWorkspaceInvitation,
  getMyInvitations,
  getAxiosErrorMessage,
} from '@/features/workspace-join/api/membership'
import { queryKeys } from '@/shared/lib/queryKeys'
import { AuthButton } from '@/shared/ui/common/AuthButton'

type Props = {
  onAccepted: (workspaceName: string) => void
}

const PAGE_SIZE = 20

export function ReceivedInvitationsPanel({ onAccepted }: Props) {
  const queryClient = useQueryClient()

  const invitationsQuery = useQuery({
    queryKey: queryKeys.workspaceMembership.invitations({
      pageSize: PAGE_SIZE,
      status: 'PENDING',
    }),
    queryFn: () =>
      getMyInvitations({ pageSize: PAGE_SIZE, status: 'PENDING' }),
  })

  const items = invitationsQuery.data?.data ?? []

  const acceptMut = useMutation({
    mutationFn: async ({
      invitationId,
      businessName,
    }: {
      invitationId: number
      businessName: string
    }) => {
      await acceptWorkspaceInvitation(invitationId)
      return businessName
    },
    onSuccess: async businessName => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembership.all,
      })
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })
      onAccepted(businessName)
    },
  })

  const declineMut = useMutation({
    mutationFn: declineWorkspaceInvitation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembership.all,
      })
    },
  })

  const isRowBusy =
    acceptMut.isPending ||
    declineMut.isPending

  return (
    <div className="flex flex-col gap-6">
      <p className="typography-body02-regular text-text-70">
        사장님이 보낸 업장 초대를 확인할 수 있어요. 만료 전에 수락 또는 거절해
        주세요.
      </p>

      {invitationsQuery.isPending ?
        <p className="typography-body02-regular text-text-70">
          불러오는 중이에요…
        </p>
      : null}

      {invitationsQuery.isError ?
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
      : null}

      {!invitationsQuery.isPending &&
      !invitationsQuery.isError &&
      items.length === 0 ?
        <p className="typography-body02-regular text-text-70">
          대기 중인 초대가 없어요. 사장님께 초대를 요청하거나 업장 검색으로 가입을
          신청해 보세요.
        </p>
      : null}

      <ul className="flex flex-col gap-3">
        {items.map(row => (
          <li
            key={row.invitationId}
            className="flex flex-col gap-3 rounded-2xl border border-line-2 bg-white px-4 py-4"
          >
            <div>
              <p className="typography-body01-semibold text-text-100">
                {row.businessName}
              </p>
              <p className="mt-1 typography-body02-regular text-text-70">
                초대 일시{' '}
                {new Date(row.invitedAt).toLocaleString('ko-KR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
              <p className="typography-body02-regular text-text-70">
                만료 예정{' '}
                {new Date(row.expiresAt).toLocaleString('ko-KR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {acceptMut.isError &&
            acceptMut.variables?.invitationId === row.invitationId ?
              <p className="typography-body02-regular text-red-600">
                {getAxiosErrorMessage(
                  acceptMut.error,
                  '수락 처리에 실패했습니다.'
                )}
              </p>
            : null}

            {declineMut.isError &&
            declineMut.variables === row.invitationId ?
              <p className="typography-body02-regular text-red-600">
                {getAxiosErrorMessage(
                  declineMut.error,
                  '거절 처리에 실패했습니다.'
                )}
              </p>
            : null}

            <div className="flex gap-2">
              <AuthButton
                type="button"
                style={{ flex: 1 }}
                disabled={isRowBusy}
                onClick={() =>
                  acceptMut.mutate({
                    invitationId: row.invitationId,
                    businessName: row.businessName,
                  })
                }
              >
                {acceptMut.isPending &&
                acceptMut.variables?.invitationId === row.invitationId ?
                  '처리 중…'
                : '수락'}
              </AuthButton>
              <button
                type="button"
                className="flex-1 rounded-xl border border-line-2 py-3 typography-body02-semibold text-text-90"
                disabled={isRowBusy}
                onClick={() => declineMut.mutate(row.invitationId)}
              >
                {declineMut.isPending &&
                declineMut.variables === row.invitationId ?
                  '처리 중…'
                : '거절'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
