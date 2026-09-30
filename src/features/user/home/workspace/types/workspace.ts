export type {
  WorkspaceItemDto,
  WorkspaceListApiResponse,
  WorkspaceListDto,
  WorkspaceListQueryParams,
  WorkspacePageDto,
} from '@/entities/workspace'

// UI Model
export interface WorkspaceItem {
  workspaceId: number
  businessName: string
  employedAt: string
  nextShiftDateTime: string | null
}
