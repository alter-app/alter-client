import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import chevronLeftIcon from '@/assets/icons/chevron-left.svg'
import socialVectorIcon from '@/assets/icons/socialvector.svg'
import imageIcon from '@/assets/icons/image.svg'
import cameraIcon from '@/assets/icons/camera.svg'

export function SocialChatPage() {
  const navigate = useNavigate()
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="h-14 bg-white border-b border-line-1 px-4 flex items-center justify-center relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 h-6 w-6"
          aria-label="뒤로가기"
        >
          <img src={chevronLeftIcon} alt="chevron-left" />
        </button>
        <h1 className="typography-headline03 text-text-100">이수연</h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-2">
        <div className="flex items-end gap-2">
          <div className="rounded-[20px] rounded-bl-[4px] bg-bg-dark px-5 py-3 typography-body01-regular text-text-100">
            안녕하세요!
          </div>
          <span className="typography-doc text-text-70">오전 12:00</span>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[160px] rounded-[20px] rounded-br-[4px] bg-sub px-5 py-3 typography-body01-regular text-white">
            안녕하세요!
          </div>
        </div>

        <div className="flex items-end justify-end gap-2">
          <span className="typography-doc text-text-70">오전 12:00</span>
          <div className="max-w-[260px] rounded-[20px] rounded-br-[4px] bg-sub px-5 py-3 typography-body01-regular text-white">
            혹시 저 대타 부탁드려도 될까요??
          </div>
        </div>
      </main>

      <div className="border-t border-line-1 bg-white p-3">
        <div className="flex items-center gap-5 rounded-[12px] px-4">
          <button
            type="button"
            onClick={() => setAttachMenuOpen(prev => !prev)}
            className="h-10 w-10 shrink-0 rounded-[10px] bg-bg-light text-4xl text-text-70 leading-none pb-1"
            aria-label="첨부"
          >
            +
          </button>
          <input
            className="flex-1 bg-transparent outline-none typography-body01-regular text-text-50"
            placeholder="메시지 입력"
          />
          <button
            type="button"
            className="h-10 w-10 shrink-0 rounded-[10px] bg-sub/25 flex items-center justify-center"
            aria-label="전송"
          >
            <img
              src={socialVectorIcon}
              alt="social-vector"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>

      {attachMenuOpen && (
        <div className="border-t border-line-1 bg-bg-light pt-10 pb-8">
          <div className="flex items-start justify-center gap-12">
            <button type="button" className="flex flex-col items-center gap-3">
              <div className="w-[64px] h-[64px] rounded-full border border-line-2 bg-white flex items-center justify-center">
                <img
                  src={imageIcon}
                  alt="image"
                  className="w-[26px] h-[26px]"
                />
              </div>
              <span className="typography-body03-regular text-text-90">
                사진
              </span>
            </button>

            <button type="button" className="flex flex-col items-center gap-3">
              <div className="w-[64px] h-[64px] rounded-full border border-line-2 bg-white flex items-center justify-center">
                <img
                  src={cameraIcon}
                  alt="camera"
                  className="w-[26px] h-[26px]"
                />
              </div>
              <span className="typography-body03-regular text-text-90">
                카메라
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
