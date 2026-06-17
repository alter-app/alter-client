import type { ReactNode } from 'react'
import { CERTIFICATE_ACCEPT_ATTR } from '@/shared/lib/certificateFileValidation'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import { formatFileSize } from '@/features/store-register/lib/formatFileSize'
import {
  CloseIcon,
  FileIcon,
  UploadIcon,
  WarningTriangleIcon,
} from '@/features/store-register/ui/icons'

export type CertificatePickState = Pick<
  ReturnType<typeof useCertificateFilePick>,
  'file' | 'error' | 'inputRef' | 'onInputChange' | 'openPicker' | 'clear'
>

type Props = {
  certificate: CertificatePickState
  headline: string
  hint?: string
  /** 선택 항목이면 "선택" 배지, 아니면 "필수" 배지 */
  optional?: boolean
  /** 선택된 파일 칩의 썸네일 아이콘 — 기본 문서 아이콘 */
  icon?: ReactNode
}

function FieldBadge({ optional }: { optional: boolean }) {
  if (optional) {
    return (
      <span className="inline-flex h-[22px] shrink-0 items-center rounded-full bg-bg-dark px-2 typography-body03-semibold text-text-70">
        선택
      </span>
    )
  }
  return (
    <span className="inline-flex h-[22px] shrink-0 items-center rounded-full bg-main-100 px-2 typography-body03-semibold text-main">
      필수
    </span>
  )
}

export function CertificateUploader({
  certificate,
  headline,
  hint,
  optional = false,
  icon,
}: Props) {
  const { file, error, inputRef, onInputChange, openPicker, clear } =
    certificate

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="typography-body01-semibold text-text-100">
          {headline}
        </span>
        <FieldBadge optional={optional} />
      </div>
      {hint ? (
        <span className="typography-body03-regular text-text-70">{hint}</span>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={CERTIFICATE_ACCEPT_ATTR}
        onChange={onInputChange}
      />

      {!file ? (
        <button
          type="button"
          onClick={openPicker}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line-2 px-4 py-6 text-text-70"
        >
          <UploadIcon className="size-7" />
          <span className="typography-body02-regular">
            파일을 선택해 주세요
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-main p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main-100 text-main">
            {icon ?? <FileIcon className="size-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate typography-body02-semibold text-text-100">
              {file.name}
            </p>
            <p className="typography-body03-regular text-text-50">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label="파일 삭제"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-light text-text-70"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      )}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-error bg-error/5 p-3">
          <WarningTriangleIcon className="size-[18px] shrink-0 text-error" />
          <span className="typography-body03-regular text-error">{error}</span>
        </div>
      ) : null}
    </div>
  )
}
