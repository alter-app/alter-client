import { CERTIFICATE_ACCEPT_ATTR } from '@/shared/lib/certificateFileValidation'
import type { CertificatePickState } from '@/features/store-register/ui/CertificateUploader'
import { COMMENT_MAX_LENGTH } from '@/features/store-register/hooks/useReasonCommentThreadViewModel'

type Props = {
  comment: string
  onCommentChange: (v: string) => void
  attachment: CertificatePickState
  submitError: string | null
  isSubmitting: boolean
  canSubmit: boolean
  onSubmit: () => void
}

/** 댓글 입력창 — 255자 카운터 + 파일 첨부 + 전송 */
export function ReasonCommentComposer({
  comment,
  onCommentChange,
  attachment,
  submitError,
  isSubmitting,
  canSubmit,
  onSubmit,
}: Props) {
  const { file, error, inputRef, onInputChange, openPicker, clear } = attachment

  return (
    <div className="mt-4 rounded-2xl border border-line-1 bg-white p-3">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={CERTIFICATE_ACCEPT_ATTR}
        onChange={onInputChange}
      />

      <textarea
        value={comment}
        onChange={e => onCommentChange(e.target.value)}
        placeholder="보강 자료에 대한 설명을 남겨 주세요."
        rows={3}
        maxLength={COMMENT_MAX_LENGTH}
        className="w-full resize-none bg-transparent outline-none typography-body02-regular text-text-100 placeholder:text-text-50"
      />

      <div className="mt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={openPicker}
          className="typography-body02-semibold text-main underline"
        >
          파일 첨부
        </button>
        <span className="typography-body02-regular text-text-50">
          {comment.length}/{COMMENT_MAX_LENGTH}
        </span>
      </div>

      {file ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-bg-light px-3 py-2">
          <span className="min-w-0 flex-1 truncate typography-body02-regular text-text-90">
            {file.name}
          </span>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 typography-body02-semibold text-text-70 underline"
          >
            삭제
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 typography-body02-regular text-error">{error}</p>
      ) : null}

      {submitError ? (
        <p className="mt-2 typography-body02-regular text-error">
          {submitError}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-3 h-11 w-full rounded-xl bg-main typography-body01-semibold text-white disabled:cursor-not-allowed disabled:bg-text-50"
      >
        {isSubmitting ? '전송 중…' : '전송'}
      </button>
    </div>
  )
}
