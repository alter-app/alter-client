import type { WorkerDto, ManagerWorkerItem } from '@/features/manager/home/types/worker'
import type { StoreWorkerRole } from '@/features/manager/home/types/storeWorkerRole'

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

export function adaptWorkerDto(dto: WorkerDto): ManagerWorkerItem {
  return {
    id: dto.id,
    name: dto.user.name,
    role: mapPositionTypeToRole(dto.position.type),
    nextWorkDate: formatNextShiftDate(dto.nextShiftDateTime),
  }
}
