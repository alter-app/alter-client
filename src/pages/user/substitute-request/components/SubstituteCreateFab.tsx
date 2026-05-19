import PlusIcon from '@/assets/icons/Plus.svg?react'

const CONTENT_MAX_WIDTH = '390px'
const DOCBAR_HEIGHT_PX = 78
const FAB_OFFSET_BOTTOM_PX = 22

interface SubstituteCreateFabProps {
  onClick: () => void
}

export function SubstituteCreateFab({ onClick }: SubstituteCreateFabProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
      style={{
        bottom: `calc(${DOCBAR_HEIGHT_PX}px + ${FAB_OFFSET_BOTTOM_PX}px)`,
      }}
    >
      <div
        className="pointer-events-auto flex w-full justify-end"
        style={{ maxWidth: CONTENT_MAX_WIDTH }}
      >
        <button
          type="button"
          aria-label="새 대타 요청"
          onClick={onClick}
          className="flex size-14 items-center justify-center rounded-full bg-main shadow-[0px_4px_12px_rgba(7,192,121,0.45)] transition-transform active:scale-95"
        >
          <PlusIcon className="size-5 text-white" aria-hidden />
        </button>
      </div>
    </div>
  )
}
