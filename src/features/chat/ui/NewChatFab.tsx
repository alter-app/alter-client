import PlusIcon from '@/assets/icons/posting/Plus.svg?react'

interface NewChatFabProps {
  onClick: () => void
}

/**
 * 개인 채팅 세그먼트에서만 노출 — 전체 채팅방은 자동 생성됩니다.
 * Docbar(78px) 위에 뜨도록 모바일 프레임(428px) 기준으로 정렬합니다.
 */
export function NewChatFab({ onClick }: NewChatFabProps) {
  return (
    <div className="pointer-events-none fixed bottom-[94px] left-1/2 z-40 w-full max-w-[428px] -translate-x-1/2 px-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClick}
          aria-label="새 채팅"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-main text-white shadow-[0px_4px_12px_rgba(7,192,121,0.35)] transition-transform active:scale-95"
        >
          <PlusIcon className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
}
