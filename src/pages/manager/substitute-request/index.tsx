import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { SubstituteProfileAvatar } from '@/pages/user/substitute-request/components/SubstituteProfileAvatar'
import { SubstituteRequestResponseActions } from '@/pages/user/substitute-request/components/SubstituteRequestResponseActions'
import { SubstituteRequestStatusBadge } from '@/pages/user/substitute-request/components/SubstituteRequestStatusBadge'
import { useManagerSubstituteRequestViewModel } from '@/features/manager/substitute/hooks/useManagerSubstituteRequestViewModel'
import { ManagerSubstituteActionModal } from '@/pages/manager/substitute-request/components/ManagerSubstituteActionModal'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'

function CardBase({ item }: { item: SubstituteRequestItem }) {
  return (
    <>
      <SubstituteProfileAvatar imageUrl={item.imageUrl} alt={item.name} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <span className="min-w-0 typography-body01-semibold text-text-100">
            {item.name}
          </span>
          <WorkerRoleBadge role={item.workerRole} />
        </div>
        <p className="mt-1 flex gap-2 typography-doc text-text-70">
          <span>대타 근무 예정일</span>
          <span>{item.scheduledDate}</span>
        </p>
      </div>
    </>
  )
}

function PendingCard({
  item,
  onApprove,
  onReject,
  disabled,
}: {
  item: SubstituteRequestItem
  onApprove: () => void
  onReject: () => void
  disabled: boolean
}) {
  return (
    <div className="flex h-[72px] w-full items-center gap-4 rounded-2xl border border-line-1 bg-white px-5">
      <CardBase item={item} />
      <SubstituteRequestResponseActions
        onAccept={onApprove}
        onReject={onReject}
        disabled={disabled}
      />
    </div>
  )
}

function StatusCard({
  item,
  uiStatus,
  label,
}: {
  item: SubstituteRequestItem
  uiStatus: 'accepted' | 'cancelled'
  label: string
}) {
  return (
    <div className="flex h-[72px] w-full items-center gap-4 rounded-2xl border border-line-1 bg-white px-5">
      <CardBase item={item} />
      <SubstituteRequestStatusBadge uiStatus={uiStatus} label={label} />
    </div>
  )
}

function Section({
  title,
  showFilter,
  children,
}: {
  title: string
  showFilter?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="typography-headline01 text-text-100">{title}</h2>
        {showFilter ? (
          <button
            type="button"
            className="flex items-center gap-2 typography-body02-regular text-text-50"
            aria-label="필터"
          >
            전체
            <DownIcon className="size-4 text-text-50" aria-hidden />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

export function ManagerSubstituteRequestPage() {
  const {
    isLoading,
    isError,
    isEmpty,
    pending,
    accepted,
    cancelled,
    actionsDisabled,
    actionModal,
    onApproveClick,
    onRejectClick,
    onActionModalClose,
    onActionModalSubmit,
  } = useManagerSubstituteRequestViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar showBorder={false} />

      <main className="mx-auto w-full max-w-[390px] flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <p className="typography-body02-regular text-text-70">
              대타 요청 목록을 불러오지 못했습니다.
            </p>
          </div>
        ) : isEmpty ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
              대타 요청이 없습니다.
            </p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <Section title="요청됨" showFilter>
                {pending.map(item => (
                  <PendingCard
                    key={item.id}
                    item={item}
                    onApprove={() => onApproveClick(Number(item.id))}
                    onReject={() => onRejectClick(Number(item.id))}
                    disabled={actionsDisabled}
                  />
                ))}
              </Section>
            )}

            {accepted.length > 0 && (
              <Section title="수락됨">
                {accepted.map(item => (
                  <StatusCard
                    key={item.id}
                    item={item}
                    uiStatus="accepted"
                    label="수락됨"
                  />
                ))}
              </Section>
            )}

            {cancelled.length > 0 && (
              <Section title="취소됨">
                {cancelled.map(item => (
                  <StatusCard
                    key={item.id}
                    item={item}
                    uiStatus="cancelled"
                    label="취소됨"
                  />
                ))}
              </Section>
            )}
          </>
        )}
      </main>

      <ManagerSubstituteActionModal
        open={actionModal.open}
        type={actionModal.type}
        pending={actionModal.pending}
        onClose={onActionModalClose}
        onSubmit={onActionModalSubmit}
      />
    </div>
  )
}
