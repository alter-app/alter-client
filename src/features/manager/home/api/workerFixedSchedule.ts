import axiosInstance from '@/shared/lib/axiosInstance'
import type { WorkerFixedScheduleApiResponse } from '@/features/manager/home/types/workerFixedSchedule'

/**
 * 매장 소속 근무자의 고정(반복) 근무 스케줄 조회.
 * 백엔드 경로가 다르면 이 파일만 수정하면 된다.
 */
export async function fetchWorkerFixedSchedules(
  workspaceId: number,
  workerId: number
): Promise<WorkerFixedScheduleApiResponse> {
  const response = await axiosInstance.get<WorkerFixedScheduleApiResponse>(
    `/manager/workspaces/${workspaceId}/workers/${workerId}/fixed-schedules`
  )
  return response.data
}
