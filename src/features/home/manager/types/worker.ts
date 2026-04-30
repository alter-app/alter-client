import { format } from 'date-fns'
import type { CommonApiResponse } from '@/shared/types/common'
import type { StoreWorkerRole } from '@/features/home/manager/types/storeWorkerRole'

// ---- API DTOs ----
export interface WorkerUserDto {
  id: number
  name: string
  contact: string
  gender: string
}

export interface WorkerStatusDto {
  value: string
  description: string
}

export interface WorkerPositionDto {
  type: string
  description: string
  emoji: string
}

export interface WorkerDto {
  id: number
  user: WorkerUserDto
  status: WorkerStatusDto
  position: WorkerPositionDto
  employedAt: string
  resignedAt: string | null
  nextShiftDateTime: string | null
}

export interface WorkerPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type WorkersApiResponse = CommonApiResponse<{
  page: WorkerPageDto
  data: WorkerDto[]
}>

// ---- Query Params ----
export interface WorkspaceWorkersQueryParams {
  workspaceId: number
  cursor?: string
  pageSize: number
  status?: string
  name?: string
}

// ---- UI Model ----
export interface ManagerWorkerItem {
  id: number
  name: string
  role: StoreWorkerRole
  nextWorkDate: string
  nextShiftDateTime: string | null
  profileImageUrl?: string
}

// ---- Adapter ----
function mapPositionTypeToRole(positionType: string): StoreWorkerRole {
  const lower = positionType.toLowerCase()
  if (lower === 'manager') return 'manager'
  if (lower === 'owner') return 'owner'
  return 'staff'
}

function formatNextShiftDate(isoDateTime: string | null): string {
  if (!isoDateTime) return '-'
  const date = new Date(isoDateTime)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y}. ${m}. ${d}.`
}

/** Home "오늘 근무자" 카드용 근무 시간 문구 */
export function formatNextShiftTimeLabel(isoDateTime: string | null): string {
  if (!isoDateTime) return '일정 없음'
  return `${format(new Date(isoDateTime), 'HH:mm')} ~`
}

export function adaptWorkerDto(dto: WorkerDto): ManagerWorkerItem {
  return {
    id: dto.id,
    name: dto.user.name,
    role: mapPositionTypeToRole(dto.position.type),
    nextWorkDate: formatNextShiftDate(dto.nextShiftDateTime),
    nextShiftDateTime: dto.nextShiftDateTime,
  }
}
