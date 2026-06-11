import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'
import { useReasonCommentThreadViewModel } from '@/features/store-register/hooks/useReasonCommentThreadViewModel'
import { ReasonCommentItem } from '@/features/store-register/ui/ReasonCommentItem'
import { ReasonCommentComposer } from '@/features/store-register/ui/ReasonCommentComposer'
import type { WorkspaceRequestReasonDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  requestId: number
  reason: WorkspaceRequestReasonDto
}

/** 반려 사유 카드 + 댓글 스레드 + 입력창 */
export function ReasonCard({ requestId, reason }: Props) {
  const thread = useReasonCommentThreadViewModel(requestId, reason.id, true)

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="rounded-xl bg-error/5 px-3 py-3">
        <p className="mb-1 typography-body02-semibold text-error">반려 사유</p>
        <p className="whitespace-pre-wrap break-words typography-body02-regular text-text-100">
          {reason.reason}
        </p>
        <p className="mt-1.5 typography-body02-regular text-text-50">
          {formatRequestDateTime(reason.createdAt)}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {thread.isLoading ? (
          <p className="typography-body02-regular text-text-50">
            댓글을 불러오는 중입니다.
          </p>
        ) : null}
        {thread.isError ? (
          <p className="typography-body02-regular text-error">
            댓글을 불러오지 못했습니다.
          </p>
        ) : null}
        {!thread.isLoading &&
        !thread.isError &&
        thread.comments.length === 0 ? (
          <p className="typography-body02-regular text-text-50">
            보강 자료를 댓글로 남기면 운영자가 재검토합니다.
          </p>
        ) : null}
        {thread.comments.map(comment => (
          <ReasonCommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      <ReasonCommentComposer
        comment={thread.comment}
        onCommentChange={thread.onCommentChange}
        attachment={thread.attachment}
        submitError={thread.submitError}
        isSubmitting={thread.isSubmitting}
        canSubmit={thread.canSubmit}
        onSubmit={thread.submit}
      />
    </article>
  )
}
