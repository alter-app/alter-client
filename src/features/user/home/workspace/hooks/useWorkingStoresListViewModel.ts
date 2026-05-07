import { useMemo } from 'react'
import type { WorkingStoreItem } from '@/features/user'

export function useWorkingStoresListViewModel(stores: WorkingStoreItem[]) {
  return useMemo(
    () => ({
      visibleStores: stores.slice(0, 3),
    }),
    [stores]
  )
}
