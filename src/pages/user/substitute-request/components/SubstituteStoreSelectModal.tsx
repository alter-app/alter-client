import { useCallback, useEffect, useState } from 'react'

import type { WorkingStoreItem } from '@/features/user/home/workspace/types/workingStore'
import { SubstituteProfileAvatar } from '@/pages/user/substitute-request/components/SubstituteProfileAvatar'
import { cn } from '@/shared/lib/utils'

interface SubstituteStoreSelectModalProps {
  open: boolean
  stores: WorkingStoreItem[]
  isLoading?: boolean
  onClose: () => void
  onConfirm: (workspaceId: number, storeName: string) => void
}

export function SubstituteStoreSelectModal({
  open,
  stores,
  isLoading,
  onClose,
  onConfirm,
}: SubstituteStoreSelectModalProps) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null
  )

  const handleClose = useCallback(() => {
    setSelectedWorkspaceId(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (open) {
      window.addEventListener('keydown', onKeyDown)
    }
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const selectedStore = stores.find(s => s.workspaceId === selectedWorkspaceId)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={handleClose}
      />

      <div
        className="relative flex max-h-[min(520px,calc(100dvh-80px))] w-full max-w-[318px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="substitute-store-select-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-line-1 px-4">
          <h2
            id="substitute-store-select-title"
            className="typography-headline03 text-text-100"
          >
            매장 선택
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="py-10 text-center typography-body02-regular text-text-70">
              로딩 중...
            </p>
          ) : stores.length === 0 ? (
            <p className="py-10 text-center typography-body02-regular text-text-70">
              선택할 수 있는 가게가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col">
              {stores.map(store => {
                const isSelected = selectedWorkspaceId === store.workspaceId
                return (
                  <li key={store.workspaceId}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center gap-3 px-6 py-5 text-left transition-colors',
                        isSelected && 'bg-bg-light'
                      )}
                      onClick={() => setSelectedWorkspaceId(store.workspaceId)}
                    >
                      <SubstituteProfileAvatar
                        imageUrl={store.thumbnailUrl}
                        alt={store.businessName}
                        size={48}
                      />
                      <span className="min-w-0 flex-1 truncate typography-body01-semibold text-text-100">
                        {store.businessName}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="shrink-0 px-5 pb-5 pt-3">
          <button
            type="button"
            disabled={selectedWorkspaceId == null}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              if (selectedStore == null) return
              setSelectedWorkspaceId(null)
              onConfirm(selectedStore.workspaceId, selectedStore.businessName)
            }}
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  )
}
