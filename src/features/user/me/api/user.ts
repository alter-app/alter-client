import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  UserMeApiResponse,
  UserMeDto,
} from '@/features/user/me/types/user'

export async function getUserMe(): Promise<UserMeDto> {
  const response = await axiosInstance.get<UserMeApiResponse>('/app/users/me')
  return response.data.data
}
