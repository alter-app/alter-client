import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ResponseGetFixedWorkerSchdules,
  RequestPostFixedWorkerSchdules,
  ResponsePostFixedWorkerSchdules,
  ResponseDeleteFixedWorkerSchdules,
  RequestPatchFixedWorkerSchdules,
} from '@/features/manager'

export async function getFixedWorkerSchdules(
  workspaceId: number
): Promise<ResponseGetFixedWorkerSchdules> {
  const response = await axiosInstance.get<ResponseGetFixedWorkerSchdules>(
    `/manager/workspaces/${workspaceId}/fixed-worker-schedules`
  )
  return response.data
}

export async function postFixedWorkerSchdules(
  workspaceId: number,
  body: RequestPostFixedWorkerSchdules
): Promise<ResponsePostFixedWorkerSchdules> {
  const response = await axiosInstance.post<ResponsePostFixedWorkerSchdules>(
    `/manager/workspaces/${workspaceId}/fixed-worker-schedules`,
    body
  )
  return response.data
}

export async function deleteFixedWorkerSchdule(
  workspaceId: number,
  workerScheduleId: number
): Promise<ResponseDeleteFixedWorkerSchdules> {
  const response =
    await axiosInstance.delete<ResponseDeleteFixedWorkerSchdules>(
      `/manager/workspaces/${workspaceId}/fixed-worker-schedules/${workerScheduleId}`
    )
  return response.data
}

export async function patchFixedWorkerSchdule(
  workspaceId: number,
  workerScheduleId: number,
  body: RequestPatchFixedWorkerSchdules
): Promise<void> {
  await axiosInstance.patch(
    `/manager/workspaces/${workspaceId}/fixed-worker-schedules/${workerScheduleId}`,
    body
  )
}
