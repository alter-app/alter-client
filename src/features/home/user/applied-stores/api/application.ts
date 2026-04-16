import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ApplicationListApiResponse,
  ApplicationListQueryParams,
} from '@/features/home/user/applied-stores/types/application'

export async function getJobApplications(
  params: ApplicationListQueryParams
): Promise<ApplicationListApiResponse> {
  const response = await axiosInstance.get<ApplicationListApiResponse>(
    '/app/users/me/postings/applications',
    {
      params: {
        pageSize: params.pageSize,
        ...(params.cursor !== undefined && { cursor: params.cursor }),
        ...(params.status?.length && { status: params.status }),
      },
    }
  )
  return response.data
}

export async function cancelJobApplication(
  applicationId: number
): Promise<void> {
  await axiosInstance.patch(
    `/app/users/me/postings/applications/${applicationId}/status`,
    { status: 'CANCELLED' }
  )
}
