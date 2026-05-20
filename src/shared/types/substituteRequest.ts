import type { WorkerRole } from '@/shared/types/workerRole'
import type { SubstituteApiStatus } from '@/shared/types/substituteStatus'

export type SubstituteRequestStatus = 'accepted' | 'pending' | 'cancelled'

export interface SubstituteRequestItem {
  id: number
  name: string
  role: string
  workerRole: WorkerRole
  dateRange: string
  scheduledDate: string
  status: SubstituteRequestStatus
  imageUrl?: string | null
  rawStatus?: SubstituteApiStatus
}
