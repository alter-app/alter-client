import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'
import { FileIcon } from '@/features/store-register/ui/icons'
import type {
  WorkspaceReasonCommentDto,
  WorkspaceReasonCommentFileDto,
} from '@/features/store-register/types/workspaceRequests'

type Props = {
  comment: WorkspaceReasonCommentDto
}

function FileChip({
  file,
  isAdmin,
}: {
  file: WorkspaceReasonCommentFileDto
  isAdmin: boolean
}) {
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex max-w-[80%] items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 ${
        isAdmin ? 'border-line-1 text-text-90' : 'border-main-300 text-sub'
      }`}
    >
      <FileIcon className="size-3.5 shrink-0" />
      <span className="truncate typography-body03-regular">첨부파일</span>
    </a>
  )
}

/** 댓글 한 건 — ADMIN 좌측 회색 / 본인 USER 우측 main 톤 */
export function ReasonCommentItem({ comment }: Props) {
  const isAdmin = comment.commentOwner === 'ADMIN'
  const time = formatRequestDateTime(comment.createdAt)

  if (isAdmin) {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="px-1 typography-body03-regular text-text-70">
          운영자
        </span>
        {comment.comment ? (
          <p className="max-w-[80%] whitespace-pre-wrap break-words rounded-[14px] rounded-tl-[4px] bg-bg-dark px-3.5 py-3 typography-body02-regular text-text-100">
            {comment.comment}
          </p>
        ) : null}
        {comment.files.map(file => (
          <FileChip key={file.fileId} file={file} isAdmin />
        ))}
        <span className="px-1 typography-body03-regular text-text-50">
          {time}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {comment.files.map(file => (
        <FileChip key={file.fileId} file={file} isAdmin={false} />
      ))}
      {comment.comment ? (
        <p className="max-w-[80%] whitespace-pre-wrap break-words rounded-[14px] rounded-tr-[4px] bg-main-100 px-3.5 py-3 typography-body02-regular text-text-100">
          {comment.comment}
        </p>
      ) : null}
      <span className="px-1 typography-body03-regular text-text-50">
        {time}
      </span>
    </div>
  )
}
