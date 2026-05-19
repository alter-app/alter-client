import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  AssignWorkerToScheduleRequest,
  CreateWorkScheduleRequest,
  UpdateWorkScheduleRequest,
} from '@/features/manager/worker-schedule/types/managerWorkSchedule'

export async function postManagerWorkSchedule(
  body: CreateWorkScheduleRequest
): Promise<void> {
  await axiosInstance.post('/manager/schedules', body)
}

export async function putManagerWorkSchedule(
  workShiftId: number,
  body: UpdateWorkScheduleRequest
): Promise<void> {
  await axiosInstance.put(`/manager/schedules/${workShiftId}`, body)
}

export async function postAssignWorkerToSchedule(
  workShiftId: number,
  body: AssignWorkerToScheduleRequest
): Promise<void> {
  await axiosInstance.post(`/manager/schedules/${workShiftId}/workers`, body)
}
