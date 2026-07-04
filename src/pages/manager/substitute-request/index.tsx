import { useState } from 'react'

import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { Avatar } from '@/shared/ui/common/Avatar'
import { SubstituteRequestResponseActions } from '@/pages/user/substitute-request/components/SubstituteRequestResponseActions'
import { SubstituteRequestStatusBadge } from '@/pages/user/substitute-request/components/SubstituteRequestStatusBadge'
import { SubstituteStatusFilterDropdown } from '@/pages/user/substitute-request/components/SubstituteStatusFilterDropdown'
import { useNavbarNotificationProps } from '@/features/notification'
import {
  useManagerSubstituteRequestViewModel,
  type ManagerSubstituteSection,
} from '@/features/manager/substitute'
import {
  statusFilterLabel,
  type SubstituteListStatusFilter,
} from '@/shared/types/substituteListFilters'
import { ManagerSubstituteActionModal } from '@/pages/manager/substitute-request/components/ManagerSubstituteActionModal'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import type { SubstituteRequestItem } from '@/shared/types/substituteRequest'

function CardBase({ item }: { item: SubstituteRequestItem }) {
  return (
    <>
      <Avatar
        src={item.imageUrl}
        alt={item.name}
        className="border border-line-1"
      />
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

function SectionList({
  section,
  showFilter,
  statusFilter,
  onStatusFilterChange,
  actionsDisabled,
  onApproveClick,
  onRejectClick,
}: {
  section: ManagerSubstituteSection
  showFilter: boolean
  statusFilter: SubstituteListStatusFilter
  onStatusFilterChange: (value: SubstituteListStatusFilter) => void
  actionsDisabled: boolean
  onApproveClick: (id: number) => void
  onRejectClick: (id: number) => void
}) {
  return (
    <section className="px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="typography-headline01 text-text-100">{section.title}</h2>
        {showFilter ? (
          <SubstituteStatusFilterDropdown
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        {section.items.map(item =>
          section.key === 'pending' ? (
            <PendingCard
              key={item.id}
              item={item}
              onApprove={() => onApproveClick(item.id)}
              onReject={() => onRejectClick(item.id)}
              disabled={actionsDisabled}
            />
          ) : (
            <StatusCard
              key={item.id}
              item={item}
              uiStatus={section.key === 'accepted' ? 'accepted' : 'cancelled'}
              label={section.title}
            />
          )
        )}
      </div>
    </section>
  )
}

export function ManagerSubstituteRequestPage() {
  const notificationProps = useNavbarNotificationProps()
  const [statusFilter, setStatusFilter] =
    useState<SubstituteListStatusFilter>('all')
  const {
    isLoading,
    isError,
    isEmpty,
    sections,
    actionsDisabled,
    actionModal,
    onApproveClick,
    onRejectClick,
    onActionModalClose,
    onActionModalSubmit,
  } = useManagerSubstituteRequestViewModel({ statusFilter })

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar showBorder={false} {...notificationProps} />

      <main className="mx-auto w-full flex-1">
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
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 pb-2 pt-6">
              <h2 className="typography-headline01 text-text-100">
                {statusFilterLabel(statusFilter)}
              </h2>
              <SubstituteStatusFilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            <div className="flex justify-center py-16">
              <p className="typography-body02-regular text-text-50">
                대타 요청이 없습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            {sections.map((section, index) => (
              <SectionList
                key={section.key}
                section={section}
                showFilter={index === 0}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                actionsDisabled={actionsDisabled}
                onApproveClick={onApproveClick}
                onRejectClick={onRejectClick}
              />
            ))}
          </>
        )}
      </main>

      <ManagerSubstituteActionModal
        open={actionModal.open}
        type={actionModal.type}
        pending={actionModal.pending}
        submitError={actionModal.error}
        onClose={onActionModalClose}
        onSubmit={onActionModalSubmit}
      />
    </div>
  )
}
