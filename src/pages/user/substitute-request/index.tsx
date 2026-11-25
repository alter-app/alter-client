import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import {
  acceptUserSubstituteRequest,
  rejectUserSubstituteRequest,
} from '@/features/user/substitute/api/userSubstituteRequests'
import type {
  ReceivedSubstituteRequestDto,
  UserSubstituteListItem,
} from '@/features/user/substitute/types'
import { useUserSubstituteRequestsViewModel } from '@/features/user/substitute/hooks/useUserSubstituteRequestsViewModel'
import {
  USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK,
  getUserSubstituteActionErrorMessage,
} from '@/features/user/substitute/lib/substituteActionError'
import { USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS } from '@/features/user/substitute/lib/substituteRefetchQueryKeys'
import type { UserSubstituteListStatusFilter } from '@/features/user/substitute'
import { useWorkspacesViewModel } from '@/features/user'
import { SubstituteCreateFab } from '@/pages/user/substitute-request/components/SubstituteCreateFab'
import { SubstituteRejectReasonModal } from '@/pages/user/substitute-request/components/SubstituteRejectReasonModal'
import { SubstituteRequestDetailView } from '@/pages/user/substitute-request/components/SubstituteRequestDetailView'
import { SubstituteRequestListSections } from '@/pages/user/substitute-request/components/SubstituteRequestListSections'
import {
  SubstituteRequestTabs,
  type SubstituteDirectionTab,
} from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import { SubstituteStoreSelectModal } from '@/pages/user/substitute-request/components/SubstituteStoreSelectModal'
import { SubstituteRequestModalFlow } from '@/pages/user/workspace-detail/components/SubstituteRequestModalFlow'
import { useNavbarNotificationProps } from '@/features/notification'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { ROUTES } from '@/shared/constants/routes'

type CreateFlowState = {
  workspaceId: number
  storeName: string
  session: number
}

type SubstituteRequestLocationState = {
  direction?: SubstituteDirectionTab
  directionTab?: SubstituteDirectionTab
  receivedDto?: ReceivedSubstituteRequestDto
  workspaceId?: number
}

function parseDirectionTab(
  value: string | null | undefined
): SubstituteDirectionTab | null {
  if (value === 'sent' || value === 'received') return value
  return null
}

function resolveDetailDirectionTab(
  searchDirection: SubstituteDirectionTab | null,
  locationState: SubstituteRequestLocationState | null
): SubstituteDirectionTab {
  return (
    searchDirection ??
    locationState?.direction ??
    (locationState?.receivedDto != null ? 'received' : 'sent')
  )
}

export function SubstituteRequestPage() {
  const navigate = useNavigate()
  const notificationProps = useNavbarNotificationProps()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { requestId: requestIdParam } = useParams<{ requestId?: string }>()
  const queryClient = useQueryClient()

  const locationState = location.state as SubstituteRequestLocationState | null

  const parsedRequestId =
    requestIdParam != null && requestIdParam !== ''
      ? Number(requestIdParam)
      : null
  const detailRequestId =
    parsedRequestId != null &&
    Number.isFinite(parsedRequestId) &&
    parsedRequestId > 0
      ? parsedRequestId
      : null

  const [directionTab, setDirectionTab] = useState<SubstituteDirectionTab>(
    () =>
      parseDirectionTab(
        locationState?.directionTab ?? locationState?.direction
      ) ?? 'sent'
  )
  const [sentStatusFilter, setSentStatusFilter] =
    useState<UserSubstituteListStatusFilter>('all')
  const [receivedStatusFilter, setReceivedStatusFilter] =
    useState<UserSubstituteListStatusFilter>('all')
  const [storePickerOpen, setStorePickerOpen] = useState(false)
  const [createFlow, setCreateFlow] = useState<CreateFlowState | null>(null)
  const [rejectRequestId, setRejectRequestId] = useState<number | null>(null)
  const [rejectError, setRejectError] = useState<string | null>(null)
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const { workspaces, isLoading: workspacesLoading } = useWorkspacesViewModel()

  const apiDirection = directionTab === 'sent' ? 'SENT' : 'RECEIVED'
  const statusFilter =
    directionTab === 'sent' ? sentStatusFilter : receivedStatusFilter
  const setStatusFilter =
    directionTab === 'sent' ? setSentStatusFilter : setReceivedStatusFilter

  const {
    sections,
    isLoading: listLoading,
    isError: listError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserSubstituteRequestsViewModel(apiDirection, { statusFilter })

  const invalidateLists = () =>
    Promise.all(
      USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS.map(queryKey =>
        queryClient.invalidateQueries({ queryKey })
      )
    )

  const acceptMutation = useMutation({
    mutationFn: (requestId: number) => acceptUserSubstituteRequest(requestId),
    onSuccess: invalidateLists,
    // 실패 안내·닫기를 막지 않도록 실패 후 재조회는 기다리지 않는다.
    onError: (error: unknown) => {
      setAcceptError(
        getUserSubstituteActionErrorMessage(
          error,
          USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK
        )
      )
      void invalidateLists()
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({
      requestId,
      targetRejectionReason,
    }: {
      requestId: number
      targetRejectionReason: string
    }) => rejectUserSubstituteRequest(requestId, { targetRejectionReason }),
    onSuccess: async () => {
      await invalidateLists()
      setRejectRequestId(null)
    },
    onError: (error: unknown) => {
      setRejectError(
        getUserSubstituteActionErrorMessage(
          error,
          USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK
        )
      )
      void invalidateLists()
    },
  })

  // 목록·상세가 같은 컴포넌트 인스턴스라 상세에 다녀오면 sentinel이 새로 마운트된다.
  // 엘리먼트를 state로 받아 마운트될 때마다 관찰을 다시 붙인다.
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!sentinelEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelEl)
    return () => observer.disconnect()
  }, [sentinelEl, hasNextPage, isFetchingNextPage, fetchNextPage])

  const closeRejectModal = () => {
    setRejectRequestId(null)
    setRejectError(null)
  }

  const handleOpenCreate = () => {
    const preselected = locationState?.workspaceId
      ? workspaces.find(w => w.workspaceId === locationState.workspaceId)
      : undefined
    if (preselected) {
      setCreateFlow({
        workspaceId: preselected.workspaceId,
        storeName: preselected.businessName,
        session: Date.now(),
      })
      return
    }
    if (workspaces.length === 1) {
      const only = workspaces[0]!
      setCreateFlow({
        workspaceId: only.workspaceId,
        storeName: only.businessName,
        session: Date.now(),
      })
      return
    }
    setStorePickerOpen(true)
  }

  const autoOpenedCreateRef = useRef(false)
  useEffect(() => {
    if (autoOpenedCreateRef.current) return
    if (workspacesLoading || !locationState?.workspaceId) return
    autoOpenedCreateRef.current = true
    handleOpenCreate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspacesLoading, locationState?.workspaceId])

  const clearWorkspacePreselect = () => {
    if (!locationState?.workspaceId) return
    const rest = { ...locationState }
    delete rest.workspaceId
    navigate(location.pathname + location.search, {
      replace: true,
      state: rest,
    })
  }

  const handleStoreConfirm = (workspaceId: number, storeName: string) => {
    setStorePickerOpen(false)
    setCreateFlow({
      workspaceId,
      storeName,
      session: Date.now(),
    })
  }

  const handleItemClick = (item: UserSubstituteListItem) => {
    if (directionTab === 'received') {
      navigate(
        `${ROUTES.USER.SUBSTITUTE_REQUEST}/${item.id}?direction=received`,
        {
          state: {
            direction: 'received',
            receivedDto: item.dto as ReceivedSubstituteRequestDto,
          },
        }
      )
      return
    }
    navigate(`${ROUTES.USER.SUBSTITUTE_REQUEST}/${item.id}?direction=sent`, {
      state: { direction: 'sent' },
    })
  }

  const detailDirectionTab =
    detailRequestId == null
      ? null
      : resolveDetailDirectionTab(
          parseDirectionTab(searchParams.get('direction')),
          locationState
        )

  const receivedFallback =
    detailDirectionTab === 'received' ? locationState?.receivedDto : undefined

  if (detailRequestId != null && detailDirectionTab != null) {
    return (
      <SubstituteRequestDetailView
        requestId={detailRequestId}
        directionTab={detailDirectionTab}
        receivedFallback={receivedFallback}
        onBack={() =>
          navigate(ROUTES.USER.SUBSTITUTE_REQUEST, {
            state: { directionTab: detailDirectionTab },
          })
        }
      />
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar showBorder={false} {...notificationProps} />
        <SubstituteRequestTabs
          activeTab={directionTab}
          onTabChange={setDirectionTab}
        />
      </div>

      <main className="mx-auto w-full max-w-[390px] flex-1 pb-24">
        {listLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : listError ? (
          <div className="flex flex-col items-center gap-3 py-16 px-4 text-center">
            <p className="typography-body02-regular text-text-70">
              대타 요청 목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              className="typography-body02-semibold text-main"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <SubstituteRequestListSections
            sections={sections}
            directionTab={directionTab}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onItemClick={handleItemClick}
            onAccept={
              directionTab === 'received'
                ? item => acceptMutation.mutate(item.id)
                : undefined
            }
            onReject={
              directionTab === 'received'
                ? item => setRejectRequestId(item.id)
                : undefined
            }
            actionsDisabled={
              acceptMutation.isPending || rejectMutation.isPending
            }
          />
        )}
        {!listLoading && !listError ? (
          <div
            ref={setSentinelEl}
            className="flex h-10 items-center justify-center"
            aria-hidden={!isFetchingNextPage}
          >
            {isFetchingNextPage ? <Spinner size={24} /> : null}
          </div>
        ) : null}
      </main>

      <SubstituteCreateFab onClick={handleOpenCreate} />

      <SubstituteStoreSelectModal
        open={storePickerOpen}
        stores={workspaces}
        isLoading={workspacesLoading}
        onClose={() => setStorePickerOpen(false)}
        onConfirm={handleStoreConfirm}
      />

      <SubstituteRejectReasonModal
        open={rejectRequestId != null}
        pending={rejectMutation.isPending}
        submitError={rejectError}
        onClose={closeRejectModal}
        onSubmit={reason => {
          if (rejectRequestId == null) return
          setRejectError(null)
          rejectMutation.mutate({
            requestId: rejectRequestId,
            targetRejectionReason: reason,
          })
        }}
      />

      <ConfirmModal
        isOpen={acceptError !== null}
        title="처리할 수 없어요"
        description={acceptError ?? undefined}
        onConfirm={() => setAcceptError(null)}
        onClose={() => setAcceptError(null)}
      />

      {createFlow != null ? (
        <SubstituteRequestModalFlow
          key={createFlow.session}
          onClose={() => {
            setCreateFlow(null)
            clearWorkspacePreselect()
          }}
          storeName={createFlow.storeName}
          initialMonth={new Date()}
          workspaceId={createFlow.workspaceId}
        />
      ) : null}
    </div>
  )
}
