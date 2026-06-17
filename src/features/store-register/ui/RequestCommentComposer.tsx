import { CERTIFICATE_ACCEPT_ATTR } from '@/shared/lib/certificateFileValidation'
import type { CertificatePickState } from '@/features/store-register/ui/CertificateUploader'
import { COMMENT_MAX_LENGTH } from '@/features/store-register/hooks/useRequestCommentThreadViewModel'
import {
  CloseIcon,
  PaperclipIcon,
  SendIcon,
} from '@/features/store-register/ui/icons'

type Props = {
  comment: string
  onCommentChange: (v: string) => void
  attachment: CertificatePickState
  submitError: string | null
  isSubmitting: boolean
  canSubmit: boolean
  onSubmit: () => void
  placeholder?: string
  /** 스레드 로딩·실패 시 입력 비활성화 */
  disabled?: boolean
}

/** 댓글 입력바 — 파일 첨부 + 단일 입력 + 전송, 255자 카운터 */
export function RequestCommentComposer({
  comment,
  onCommentChange,
  attachment,
  submitError,
  isSubmitting,
  canSubmit,
  onSubmit,
  placeholder = '추가 자료나 설명을 남겨 재심사를 요청하세요',
  disabled = false,
}: Props) {
  const { file, error, inputRef, onInputChange, openPicker, clear } = attachment

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-line-1 bg-white p-3">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={CERTIFICATE_ACCEPT_ATTR}
        onChange={onInputChange}
      />

      {file ? (
        <div className="flex items-center gap-2 rounded-lg bg-bg-light px-3 py-2">
          <span className="min-w-0 flex-1 truncate typography-body03-regular text-text-90">
            {file.name}
          </span>
          <button
            type="button"
            onClick={clear}
            aria-label="첨부 삭제"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-70"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          aria-label="파일 첨부"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-line-1 bg-white text-text-70 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <PaperclipIcon className="size-5" />
        </button>
        <input
          type="text"
          value={comment}
          onChange={e => onCommentChange(e.target.value)}
          placeholder={placeholder}
          maxLength={COMMENT_MAX_LENGTH}
          disabled={disabled}
          className="h-11 min-w-0 flex-1 rounded-xl border border-line-2 px-3.5 outline-none typography-body02-regular text-text-100 placeholder:text-text-50 focus:border-main disabled:cursor-not-allowed disabled:bg-bg-light disabled:text-text-50"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !canSubmit}
          aria-label={isSubmitting ? '전송 중' : '전송'}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-main text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <SendIcon className="size-5" />
        </button>
      </div>

      {!disabled ? (
        <span className="self-end typography-body03-regular text-text-50">
          {comment.length}/{COMMENT_MAX_LENGTH}
        </span>
      ) : null}

      {error ? (
        <p className="typography-body03-regular text-error">{error}</p>
      ) : null}

      {submitError ? (
        <p className="typography-body03-regular text-error">{submitError}</p>
      ) : null}
    </div>
  )
}
