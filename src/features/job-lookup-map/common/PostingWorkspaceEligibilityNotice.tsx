import type { PostingWorkspaceEligibilityStatus } from '@/features/job-lookup-map/hooks/usePostingWorkspaceEligibility'

interface PostingWorkspaceEligibilityNoticeProps {
  status: PostingWorkspaceEligibilityStatus
  onRetry: () => void
}

export function PostingWorkspaceEligibilityNotice({
  status,
  onRetry,
}: PostingWorkspaceEligibilityNoticeProps) {
  if (status === 'eligible') return null

  if (status === 'error') {
    return (
      <div className="mb-2 flex flex-col items-center gap-2">
        <p
          className="text-center typography-body03-regular text-sub"
          role="alert"
        >
          근무 중인 업장인지 확인하지 못했습니다.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-2xl border border-line-2 px-4 py-2 typography-body03-semibold text-text-70"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <p
      className="mb-2 text-center typography-body03-regular text-text-70"
      role="status"
    >
      {status === 'employed'
        ? '이미 근무 중인 업장입니다.'
        : '근무 중인 업장인지 확인하는 중…'}
    </p>
  )
}
