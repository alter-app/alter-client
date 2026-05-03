import { CERTIFICATE_ACCEPT_ATTR } from '@/shared/lib/certificateFileValidation'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'

export type CertificatePickState = Pick<
  ReturnType<typeof useCertificateFilePick>,
  | 'file'
  | 'previewUrl'
  | 'error'
  | 'isPdf'
  | 'inputRef'
  | 'onInputChange'
  | 'openPicker'
  | 'clear'
>

type Props = {
  certificate: CertificatePickState
  headline: string
  hint?: string
}

export function CertificateUploader({
  certificate,
  headline,
  hint = '촬영·스캔 이미지(JPG·PNG 등) 또는 PDF · 최대 15MB',
}: Props) {
  const {
    file,
    previewUrl,
    error,
    isPdf,
    inputRef,
    onInputChange,
    openPicker,
    clear,
  } = certificate

  return (
    <div className="w-full">
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
          className="flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line-2 bg-white px-4 py-6"
        >
          <span className="typography-headline03 text-center text-text-100">
            {headline}
          </span>
          <span className="typography-body02-regular text-center text-text-70">
            {hint}
          </span>
          <span className="mt-2 rounded-xl bg-main px-4 py-2 typography-body02-semibold text-white">
            파일 선택
          </span>
        </button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line-2 bg-white">
          <div className="flex items-stretch gap-3 p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={`${file.name} 미리보기`}
                className="h-[100px] w-[100px] shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[100px] w-[100px] shrink-0 flex-col items-center justify-center rounded-lg bg-bg-light">
                <span className="typography-body02-semibold text-text-90">
                  PDF
                </span>
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <p className="truncate typography-body01-semibold text-text-100">
                {headline}
              </p>
              <p className="truncate typography-body02-regular text-text-70">
                {file.name}
              </p>
              <p className="typography-body02-regular text-text-70">
                {isPdf
                  ? 'PDF 파일입니다. 운영자 검토까지 그대로 제출됩니다.'
                  : '이미지 파일입니다.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="typography-body02-semibold text-main underline"
                  onClick={openPicker}
                >
                  다른 파일로 바꾸기
                </button>
                <button
                  type="button"
                  className="typography-body02-semibold text-text-70 underline"
                  onClick={clear}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <p className="mt-3 typography-body02-regular text-red-600">{error}</p>
      ) : null}
    </div>
  )
}
