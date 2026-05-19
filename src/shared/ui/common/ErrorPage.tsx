import errorLoadFolderIcon from '@/assets/icons/error-load-folder.svg'
import { cn } from '@/shared/lib/utils'

export interface ErrorPageProps {
  message?: string
  retryLabel?: string
  reportLabel?: string
  onRetry?: () => void
  onReportIssue?: () => void
  showReportButton?: boolean
  className?: string
}

export function ErrorPage({
  message = '정보를 불러올 수 없어요',
  retryLabel = '다시 불러오기',
  reportLabel = '불편사항 신고',
  onRetry,
  onReportIssue,
  showReportButton = true,
  className,
}: ErrorPageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4',
        className
      )}
    >
      <img
        src={errorLoadFolderIcon}
        alt=""
        width={66}
        height={56}
        className="mb-6 h-14 w-[66px] shrink-0"
        aria-hidden
      />

      <p className="mb-8 text-center typography-body01-semibold text-text-100">
        {message}
      </p>

      <div className="flex w-[148px] flex-col gap-3">
        {onRetry != null && (
          <button
            type="button"
            onClick={onRetry}
            className="flex w-full items-center justify-center rounded-2xl bg-main p-2.5 typography-body01-semibold text-white"
          >
            {retryLabel}
          </button>
        )}

        {showReportButton && onReportIssue != null && (
          <button
            type="button"
            onClick={onReportIssue}
            className="flex w-full items-center justify-center rounded-2xl border border-line-2 bg-white p-2.5 typography-body01-semibold text-text-50"
          >
            {reportLabel}
          </button>
        )}
      </div>
    </div>
  )
}
