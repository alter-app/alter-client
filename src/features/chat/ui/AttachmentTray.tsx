import { useRef, type ChangeEvent } from 'react'
import cameraIcon from '@/assets/icons/camera.svg'
import imageIcon from '@/assets/icons/image.svg'

interface AttachmentTrayProps {
  /** 선택한 이미지를 업로드해 전송합니다 */
  onSelectImages?: (files: File[]) => void
  /** 업로드·전송이 끝날 때까지 재선택을 막습니다 */
  isSending?: boolean
}

export function AttachmentTray({
  onSelectImages,
  isSending = false,
}: AttachmentTrayProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    // 같은 파일을 연속으로 고를 수 있도록 값을 비웁니다
    event.target.value = ''
    if (files.length > 0) onSelectImages?.(files)
  }

  const isDisabled = isSending || !onSelectImages

  return (
    <div className="border-t border-line-1 bg-bg-light pb-8 pt-8">
      <div className="flex items-start justify-center gap-12">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => galleryInputRef.current?.click()}
          className="flex flex-col items-center gap-3 disabled:opacity-60"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line-2 bg-white">
            <img
              src={imageIcon}
              alt=""
              aria-hidden
              className="h-[26px] w-[26px]"
            />
          </span>
          <span className="typography-body03-regular text-text-90">사진</span>
        </button>

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center gap-3 disabled:opacity-60"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line-2 bg-white">
            <img
              src={cameraIcon}
              alt=""
              aria-hidden
              className="h-[26px] w-[26px]"
            />
          </span>
          <span className="typography-body03-regular text-text-90">카메라</span>
        </button>
      </div>

      {isSending ? (
        <p
          className="mt-4 text-center typography-doc text-text-50"
          role="status"
        >
          사진을 보내는 중이에요…
        </p>
      ) : null}

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        aria-label="사진 선택"
        onChange={handleChange}
      />
      {/* capture 는 모바일에서 카메라를 바로 띄웁니다(데스크톱은 파일 선택으로 폴백) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        aria-label="카메라로 촬영"
        onChange={handleChange}
      />
    </div>
  )
}
