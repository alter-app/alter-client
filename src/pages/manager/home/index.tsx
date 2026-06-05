import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useNavigate } from 'react-router-dom'
import {
  TodayWorkerList,
  StoreWorkerListItem,
  WorkspaceChangeList,
  useManagerHomeViewModel,
} from '@/features/manager'
import { MonthlyCalendar } from '@/features/home/common/schedule/ui/MonthlyCalendar'
import { OngoingPostingCard } from '@/shared/ui/manager/OngoingPostingCard'
import { SubstituteApprovalCard } from '@/shared/ui/manager/SubstituteApprovalCard'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import { WorkCategoryBadge } from '@/shared/ui/home/WorkCategoryBadge'
import managerHomeBannerImage from '@/assets/manager-home-banner.jpg'
import managerHomeBannerPlusIcon from '@/assets/icons/home/manager-home-banner-plus.svg'
import managerWorkspaceModalPlusIcon from '@/assets/icons/home/manager-workspace-modal-plus.svg'
import managerScheduleEditIcon from '@/assets/icons/home/edit.svg'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'
import { useResignWorkerMutation } from '@/features/manager/worker-list/hooks/mutation/useResignWorkerMutation'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import ResignIcon from '@/assets/icons/home/resign.svg?react'

export function ManagerHomePage() {
  const navigate = useNavigate()
  const [resignTargetWorkerId, setResignTargetWorkerId] = useState<
    number | null
  >(null)
  const {
    todayWorkers,
    storeWorkers,
    storeWorkersTotalCount,
    showMoreWorkers,
    hasMoreWorkers,
    isFetchingMoreWorkers,
    ongoingPostings,
    postingsTotalCount,
    showMorePostings,
    hasMorePostings,
    substituteRequests,
    substituteTotalCount,
    showMoreSubstitutes,
    hasMoreSubstitutes,
    schedule,
    activeWorkspaceId,
    workspaceDetail,
    workspaceChangeModal,
    openWorkspaceChangeModal,
    closeWorkspaceChangeModal,
    selectWorkspace,
  } = useManagerHomeViewModel()

  const { mutate: resignWorker, isPending: isResigning } =
    useResignWorkerMutation(activeWorkspaceId ?? 0)

  return (
    <>
      <div className="flex min-h-[100dvh] flex-col box-border bg-bg-light">
        <Navbar />

        <div className="relative h-[200px] w-full overflow-hidden">
          <img
            src={managerHomeBannerImage}
            alt="가게 배너 이미지"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-text-100" />

          <div className="absolute bottom-8 left-[20px] text-white">
            <div className="mb-1 flex items-center gap-2">
              <p className="typography-headline01">
                {workspaceDetail?.businessName ?? ''}
              </p>
              <WorkCategoryBadge label={workspaceDetail?.businessType ?? ''} />
            </div>
            <p className="typography-body01-regular leading-[1.4]">
              {workspaceDetail?.fullAddress ?? ''}
            </p>
            <p className="typography-body01-regular leading-[1.4]">
              {workspaceDetail?.businessName ?? ''}
            </p>
          </div>

          <button
            type="button"
            aria-label="배너 상세 보기"
            className="absolute bottom-[40px] right-[20px] h-[26px] w-[26px]"
            onClick={openWorkspaceChangeModal}
          >
            <img
              src={managerHomeBannerPlusIcon}
              alt=""
              aria-hidden="true"
              className="h-full w-full"
            />
          </button>
        </div>
        {workspaceChangeModal.isOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[220px]"
            role="presentation"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
              aria-label="업장 변경 모달 닫기"
              onClick={closeWorkspaceChangeModal}
            />

            <div
              className="relative w-full max-w-[358px] rounded-[16px] bg-white px-6 pb-[25px] pt-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="workspace-change-modal-title"
            >
              <h2
                id="workspace-change-modal-title"
                className="typography-headline01 text-text-100"
              >
                업장 변경 / 추가
              </h2>

              <WorkspaceChangeList
                workspaces={workspaceChangeModal.items}
                selectedWorkspaceId={
                  workspaceChangeModal.selectedWorkspaceId ?? undefined
                }
                className="mt-[19px]"
                onSelectWorkspace={selectWorkspace}
              />

              <button
                type="button"
                className="mx-auto mt-4 flex h-[26px] w-[26px] items-center justify-center"
                aria-label="업장 추가"
                onClick={() => navigate('/manager/store-register')}
              >
                <img
                  src={managerWorkspaceModalPlusIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full"
                />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white pt-3 px-8 pb-5">
          <div className="flex items-center justify-between">
            <div className="typography-headline02">
              {format(new Date(), 'M월 d일', { locale: ko })}
            </div>
            <button
              type="button"
              className="typography-bg"
              onClick={() => navigate(ROUTES.MANAGER.WORKER_LIST)}
            >
              전체 보기
            </button>
          </div>
          <div className="pt-6">
            <TodayWorkerList workers={todayWorkers} />
          </div>
        </div>
        <section className="px-4 pt-4">
          <p className="typography-headline01 text-text-100 mb-4">
            우리 매장 시간표
          </p>
          <MonthlyCalendar
            baseDate={schedule.baseDate}
            data={schedule.data}
            layout="manager"
            hideTitle
            isLoading={schedule.isLoading}
            selectedDateKey={schedule.selectedDateKey}
            onMonthChange={schedule.onDateChange}
            rightAction={
              <button
                type="button"
                aria-label="업장 스케줄 수정"
                className="flex h-6 w-6 items-center justify-center"
                onClick={() => {
                  if (
                    activeWorkspaceId === null ||
                    storeWorkers[0] === undefined
                  ) {
                    navigate(ROUTES.MANAGER.WORKER_SCHEDULE)
                    return
                  }
                  navigate(
                    managerWorkerSchedulePath(
                      activeWorkspaceId,
                      storeWorkers[0].id
                    )
                  )
                }}
              >
                <img
                  src={managerScheduleEditIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full"
                />
              </button>
            }
          />
        </section>

        <div className="pt-6 pb-8">
          <div className="mb-3 flex items-center justify-between px-5">
            <h2 className="typography-headline01 text-gray-900">
              우리 매장 근무자
            </h2>
            <button
              type="button"
              className="rounded-lg bg-main px-3 py-1.5 typography-body02-semibold text-white"
              onClick={() => navigate(ROUTES.MANAGER.WORKER_INVITE)}
            >
              근무자 초대
            </button>
          </div>

          <div className="bg-white mx-4 py-8  rounded-[16px] shadow-sm overflow-hidden flex flex-col">
            {storeWorkers.length === 0 ? (
              <p className="px-4 py-8 text-center typography-body02-regular text-text-50">
                근무자가 없습니다
              </p>
            ) : (
              <div className="px-4 gap-6 flex flex-col">
                {storeWorkers.map(worker => (
                  <StoreWorkerListItem
                    key={worker.id}
                    name={worker.name}
                    role={worker.role}
                    nextWorkDate={worker.nextWorkDate}
                    profileImageUrl={worker.profileImageUrl}
                    menuItems={[
                      {
                        icon: <ResignIcon width={20} height={20} />,
                        label: '퇴사하기',
                        onClick: () => setResignTargetWorkerId(worker.id),
                      },
                    ]}
                  />
                ))}
                {storeWorkers.length < storeWorkersTotalCount &&
                  hasMoreWorkers && (
                    <MoreButton
                      onClick={() => showMoreWorkers()}
                      disabled={isFetchingMoreWorkers}
                    />
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="pt-6 pb-8">
          <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
            진행 중인 공고{' '}
            <span className="text-sub">{postingsTotalCount}</span>건
          </h2>
          <div className="mx-4">
            <OngoingPostingCard
              postings={ongoingPostings}
              onViewMore={
                ongoingPostings.length < postingsTotalCount && hasMorePostings
                  ? () => showMorePostings()
                  : undefined
              }
              onPostingClick={() => {}}
            />
          </div>
        </div>
        <div className="pt-6 pb-8">
          <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
            대타 승인 요청{' '}
            <span className="text-sub">{substituteTotalCount}</span>건
          </h2>
          <div className="mx-4">
            <SubstituteApprovalCard
              requests={substituteRequests}
              onViewMore={
                substituteRequests.length < substituteTotalCount &&
                hasMoreSubstitutes
                  ? () => showMoreSubstitutes()
                  : undefined
              }
              onRequestClick={() => {}}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={resignTargetWorkerId !== null}
        title="퇴사 처리하시겠어요?"
        description="퇴사 처리 후에는 되돌릴 수 없습니다."
        confirmLabel="퇴사하기"
        isPending={isResigning}
        onConfirm={() => {
          if (resignTargetWorkerId === null) return
          resignWorker(resignTargetWorkerId, {
            onSuccess: () => setResignTargetWorkerId(null),
          })
        }}
        onClose={() => setResignTargetWorkerId(null)}
      />
    </>
  )
}
