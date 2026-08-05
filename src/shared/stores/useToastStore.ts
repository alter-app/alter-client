import { create } from 'zustand'

export type ToastVariant = 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

/** 자동 dismiss 지연(ms) */
export const TOAST_DURATION = 2000

interface ToastState {
  toasts: ToastItem[]
  showToast: (message: string, variant?: ToastVariant) => void
  dismissToast: (id: number) => void
}

let toastSeq = 0

export const useToastStore = create<ToastState>(set => ({
  toasts: [],
  showToast: (message, variant = 'success') => {
    toastSeq += 1
    const id = toastSeq
    set(state => ({ toasts: [...state.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, TOAST_DURATION)
  },
  dismissToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

/**
 * 컴포넌트 외부(핸들러·훅)에서도 호출 가능한 단축 함수
 * 예) showToast('최종합격 처리됐어요')
 */
export function showToast(message: string, variant: ToastVariant = 'success') {
  useToastStore.getState().showToast(message, variant)
}

export default useToastStore
