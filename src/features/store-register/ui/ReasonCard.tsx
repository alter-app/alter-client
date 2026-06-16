import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'
import { useReasonCommentThreadViewModel } from '@/features/store-register/hooks/useReasonCommentThreadViewModel'
import { ReasonCommentItem } from '@/features/store-register/ui/ReasonCommentItem'
import { ReasonCommentComposer } from '@/features/store-register/ui/ReasonCommentComposer'
import {
  ChatIcon,
  WarningTriangleIcon,
} from '@/features/store-register/ui/icons'
import type { WorkspaceRequestReasonDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  requestId: number
  reason: WorkspaceRequestReasonDto
}

/** 반려 사유 카드 + 재심사 안내 + 댓글 스레드 + 입력창 */
export function ReasonCard({ requestId, reason }: Props) {
  const thread = useReasonCommentThreadViewModel(requestId, reason.id, true)

  return (
    <article className="flex flex-col gap-4">
      <div className="flex gap-3 rounded-xl border border-line-1 bg-white p-4">
        <WarningTriangleIcon className="size-[22px] mt-px shrink-0 text-warning" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="whitespace-pre-wrap break-words typography-body01-regular text-text-100">
            {reason.reason}
          </p>
          <p className="typography-body03-regular text-text-50">
            {formatRequestDateTime(reason.createdAt)} · 운영자
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-main-100 px-4 py-3.5">
        <ChatIcon className="size-[18px] shrink-0 text-main" />
        <p className="typography-body02-regular text-text-100">
          댓글로 자료를 보강해{' '}
          <span className="typography-body02-semibold text-main">재심사</span>를
          요청할 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <h3 className="typography-headline03 text-text-100">재심사 문의</h3>
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
            보강 자료나 설명을 댓글로 남기면 운영자가 재검토해요.
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
