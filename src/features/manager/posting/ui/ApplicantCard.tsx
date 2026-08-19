import CalendarIcon from '@/assets/icons/posting/Calendar.svg?react'
import ClockIcon from '@/assets/icons/posting/Clock.svg?react'
import { ManagerApplicationStatusBadge } from '@/features/manager/posting/ui/ManagerApplicationStatusBadge'
import {
  formatRelativeTime,
  formatTimeRange,
  formatWorkingDays,
  type ApplicationListItem,
} from '@/features/manager/posting/types/posting'

interface ApplicantCardProps {
  application: ApplicationListItem
  onClick: () => void
}

export function ApplicantCard({ application, onClick }: ApplicantCardProps) {
  const { applicantName, schedule } = application

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-colors hover:bg-bg-light/60"
    >
      <div className="flex flex-col gap-3 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 typography-body02-semibold text-text-100">
            {application.workspaceName}
          </span>
          <ManagerApplicationStatusBadge status={application.status} />
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-main-100 typography-body03-semibold text-sub"
            aria-hidden="true"
          >
            {applicantName.charAt(0)}
          </span>
          <span className="typography-body01-semibold text-text-100">
            {applicantName}
          </span>
          <span className="ml-auto typography-body03-regular text-text-50">
            {formatRelativeTime(application.appliedAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-1 px-4 py-3 typography-body03-regular text-text-90">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="size-4 text-main" />
          {formatWorkingDays(schedule.workingDays)}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="size-4 text-main" />
          {formatTimeRange(schedule.startTime, schedule.endTime)}
        </span>
        {schedule.position ? (
          <span className="text-text-70">{schedule.position}</span>
        ) : null}
      </div>
    </button>
  )
}
