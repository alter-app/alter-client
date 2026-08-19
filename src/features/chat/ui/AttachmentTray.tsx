import cameraIcon from '@/assets/icons/camera.svg'
import imageIcon from '@/assets/icons/image.svg'

const ATTACHMENT_ITEMS = [
  { key: 'gallery', label: '사진', icon: imageIcon },
  { key: 'camera', label: '카메라', icon: cameraIcon },
] as const

/**
 * P1 · 디자인만 — 이미지 메시지는 백엔드 미지원이라 데이터 연결이 없습니다.
 * 업로드 API(`targetType: CHAT_MESSAGE`)가 열리면 각 버튼에 핸들러를 붙이면 됩니다.
 */
export function AttachmentTray() {
  return (
    <div className="border-t border-line-1 bg-bg-light pb-8 pt-8">
      <div className="flex items-start justify-center gap-12">
        {ATTACHMENT_ITEMS.map(item => (
          <button
            key={item.key}
            type="button"
            disabled
            className="flex flex-col items-center gap-3 disabled:opacity-60"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line-2 bg-white">
              <img
                src={item.icon}
                alt=""
                aria-hidden
                className="h-[26px] w-[26px]"
              />
            </span>
            <span className="typography-body03-regular text-text-90">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center typography-doc text-text-50">
        사진 전송은 준비 중이에요.
      </p>
    </div>
  )
}
