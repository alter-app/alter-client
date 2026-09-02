import { Spinner } from '@/shared/ui/Spinner'
import {
  AlertCircleIcon,
  CloseIcon,
  PlusIcon,
} from '@/features/store-register/ui/icons'
import type { useRepresentativeImagePick } from '@/features/store-register/hooks/useRepresentativeImagePick'

type Props = {
  picker: ReturnType<typeof useRepresentativeImagePick>
}

/** 업장 대표 이미지 선택 — 첫 번째 장이 메인(sortOrder 0)으로 전송됩니다 */
export function RepresentativeImagePicker({ picker }: Props) {
  const {
    images,
    inputRef,
    accept,
    maxCount,
    canAddMore,
    error,
    isUploading,
    openPicker,
    onFileChange,
    removeImage,
    setAsMain,
  } = picker

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="typography-body02-semibold text-text-100">
          대표 이미지 (선택)
        </h2>
        <span className="typography-body03-regular text-text-70">
          {images.length}/{maxCount}
        </span>
      </div>
      <p className="typography-body03-regular text-text-70">
        JPG·PNG 20MB 이하, 첫 번째 이미지가 메인으로 노출돼요.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="mt-1 grid grid-cols-3 gap-2">
        {canAddMore ? (
          <button
            type="button"
            onClick={openPicker}
            disabled={isUploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-2 bg-white text-text-70 disabled:opacity-60"
          >
            <span className="leading-none text-main">
              {isUploading ? <Spinner size={22} /> : <PlusIcon />}
            </span>
            <span className="typography-body03-regular">
              {isUploading ? '업로드 중' : '사진 추가'}
            </span>
          </button>
        ) : null}

        {images.map((image, index) => (
          <div
            key={image.fileId}
            className="relative aspect-square overflow-hidden rounded-xl bg-bg-dark"
          >
            <img
              src={image.url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              aria-label="이미지 제거"
              onClick={() => removeImage(image.fileId)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <CloseIcon width={14} height={14} />
            </button>
            {index === 0 ? (
              <span className="absolute bottom-1 left-1 rounded-full bg-main px-2 py-0.5 typography-body03-regular text-white">
                메인
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setAsMain(image.fileId)}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-2 py-0.5 typography-body03-regular text-white"
              >
                메인으로
              </button>
            )}
          </div>
        ))}
      </div>

      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1 typography-body03-regular text-error"
        >
          <AlertCircleIcon className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </section>
  )
}
