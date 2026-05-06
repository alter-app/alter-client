import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useNavigate } from 'react-router-dom'
import { TodayWorkerList } from '@/features/home/manager/ui/TodayWorkerList'
import { StoreWorkerListItem } from '@/features/home/manager/ui/StoreWorkerListItem'
import { useManagerHomeViewModel } from '@/features/home/manager/hooks/useManagerHomeViewModel'
import { WorkspaceChangeList } from '@/features/home/manager/ui/WorkspaceChangeList'
import { MonthlyCalendar } from '@/features/home/common/schedule/ui/MonthlyCalendar'
import { OngoingPostingCard } from '@/shared/ui/manager/OngoingPostingCard'
import { SubstituteApprovalCard } from '@/shared/ui/manager/SubstituteApprovalCard'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import { WorkCategoryBadge } from '@/shared/ui/home/WorkCategoryBadge'
import managerHomeBannerImage from '@/assets/manager-home-banner.jpg'
import managerHomeBannerPlusIcon from '@/assets/icons/home/manager-home-banner-plus.svg'
import managerWorkspaceModalPlusIcon from '@/assets/icons/home/manager-workspace-modal-plus.svg'
import managerScheduleEditIcon from '@/assets/icons/home/edit.svg'

export function ManagerHomePage() {
  const navigate = useNavigate()
  const {
    todayWorkers,
    storeWorkers,
    fetchMoreWorkers,
    hasMoreWorkers,
    isFetchingMoreWorkers,
    ongoingPostings,
    postingsTotalCount,
    fetchMorePostings,
    hasMorePostings,
    substituteRequests,
    substituteTotalCount,
    fetchMoreSubstitutes,
    hasMoreSubstitutes,
    schedule,
    workspaceDetail,
    workspaceChangeModal,
    openWorkspaceChangeModal,
    closeWorkspaceChangeModal,
    selectWorkspace,
  } = useManagerHomeViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col box-border bg-bg-light">
      <Navbar />

      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={managerHomeBannerImage}
          alt="가게 배너 이미지"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(35,35,35,0)] to-[#232323]" />

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
          {/* TODO: 스케줄 관리 페이지 UI 추가시 구현해야함*/}
          <div className="typography-bg">전체 보기</div>
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
              onClick={() => navigate('/manager/worker-schedule')}
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
        <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
          우리 매장 근무자
        </h2>

        <div className="bg-white mx-4 py-8  rounded-[16px] shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 gap-6 flex flex-col">
            {storeWorkers.map(worker => (
              <StoreWorkerListItem
                key={worker.id}
                name={worker.name}
                role={worker.role}
                nextWorkDate={worker.nextWorkDate}
                profileImageUrl={worker.profileImageUrl}
                onOptions={() => {}}
              />
            ))}
            {hasMoreWorkers && (
              <MoreButton
                onClick={() => fetchMoreWorkers()}
                disabled={isFetchingMoreWorkers}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pt-6 pb-8">
        <h2 className="px-5 mb-3 typography-headline01 text-gray-900">
          진행 중인 공고 <span className="text-sub">{postingsTotalCount}</span>
          건
        </h2>
        <div className="mx-4">
          <OngoingPostingCard
            postings={ongoingPostings}
            onViewMore={hasMorePostings ? () => fetchMorePostings() : undefined}
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
              hasMoreSubstitutes ? () => fetchMoreSubstitutes() : undefined
            }
            onRequestClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
