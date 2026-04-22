import { useMemo } from 'react'
import type { WorkingStoreItem } from '@/features/home/user/workspace/ui/WorkingStoreCard'

export function useWorkingStoresListViewModel(stores: WorkingStoreItem[]) {
  return useMemo(
    () => ({
      visibleStores: stores.slice(0, 3),
    }),
    [stores]
  )
}
