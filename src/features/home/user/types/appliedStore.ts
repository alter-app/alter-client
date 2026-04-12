export type ApplicationStatus = 'submitted' | 'accepted' | 'cancelled'

export type FilterType =
  | 'all'
  | 'completed'
  | 'viewed'
  | 'not_viewed'
  | 'cancelled'

export interface AppliedStoreData {
  id: number
  storeName: string
  status: ApplicationStatus
  filterType: FilterType
  thumbnailUrl?: string
}
