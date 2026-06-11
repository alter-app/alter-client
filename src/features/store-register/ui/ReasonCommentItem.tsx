import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'
import type { WorkspaceReasonCommentDto } from '@/features/store-register/types/workspaceRequests'

type Props = {
  comment: WorkspaceReasonCommentDto
}

/** 댓글 한 건 — ADMIN 좌측 회색 / 본인 USER 우측 main 톤 */
export function ReasonCommentItem({ comment }: Props) {
  const isAdmin = comment.commentOwner === 'ADMIN'

  return (
    <div className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          isAdmin
            ? 'rounded-tl-sm bg-bg-dark text-text-100'
            : 'rounded-tr-sm bg-main-100 text-text-100'
        }`}
      >
        <span className="mb-1 block typography-body02-semibold text-text-70">
          {isAdmin ? '운영자' : '나'}
        </span>
        {comment.comment ? (
          <p className="whitespace-pre-wrap break-words typography-body02-regular">
            {comment.comment}
          </p>
        ) : null}
        {comment.files.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {comment.files.map((file, index) => (
              <a
                key={file.fileId}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-line-1 bg-white px-2.5 py-1 typography-body02-semibold text-main"
              >
                첨부 {comment.files.length > 1 ? index + 1 : ''}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <span className="mt-1 px-1 typography-body02-regular text-text-50">
        {formatRequestDateTime(comment.createdAt)}
      </span>
    </div>
  )
}
