import { Toast } from '@/shared/ui/common/Toast'
import { useToastStore } from '@/shared/stores/useToastStore'

/**
 * 앱 루트에 1회 마운트하는 Toast 렌더링 영역.
 * Docbar(h-14) 위쪽에 겹치지 않도록 bottom 여백을 둡니다.
 */
export function ToastViewport() {
  const toasts = useToastStore(state => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-full max-w-[428px] -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          className="animate-toast-in"
        />
      ))}
    </div>
  )
}
