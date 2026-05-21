import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  LinkSocialAccountRequest,
  SendEmailVerificationRequest,
  SocialAccountStatusDto,
  SocialProvider,
  UpdateEmailRequest,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
  UpdateProfileImageRequest,
  UserMeApiResponse,
  UserMeDto,
  UserMeScope,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponseDto,
} from '@/features/user/me/types/user'

function getSelfBasePath(scope: UserMeScope): string {
  return scope === 'MANAGER' ? '/manager/me' : '/app/users/me'
}

function getSocialBasePath(scope: UserMeScope): string {
  return scope === 'MANAGER' ? '/manager/me/social' : '/app/users/social'
}

export async function getUserMe(scope: UserMeScope): Promise<UserMeDto> {
  const response = await axiosInstance.get<UserMeApiResponse>(
    getSelfBasePath(scope)
  )
  return response.data.data
}

export async function updateUserNickname(options: {
  scope: UserMeScope
  nickname: string
}): Promise<void> {
  const body: UpdateNicknameRequest = { nickname: options.nickname }
  await axiosInstance.put(`${getSelfBasePath(options.scope)}/nickname`, body)
}

export async function updateUserProfileImage(options: {
  scope: UserMeScope
  fileId: string
}): Promise<void> {
  const body: UpdateProfileImageRequest = { fileId: options.fileId }
  await axiosInstance.put(
    `${getSelfBasePath(options.scope)}/profile-image`,
    body
  )
}

export async function deleteUserProfileImage(
  scope: UserMeScope
): Promise<void> {
  await axiosInstance.delete(`${getSelfBasePath(scope)}/profile-image`)
}

export async function updateUserPassword(options: {
  scope: UserMeScope
  currentPassword?: string
  newPassword: string
}): Promise<void> {
  const body: UpdatePasswordRequest = {
    newPassword: options.newPassword,
    ...(options.currentPassword?.trim()
      ? { currentPassword: options.currentPassword }
      : {}),
  }
  await axiosInstance.put(`${getSelfBasePath(options.scope)}/password`, body)
}

export async function sendUserEmailVerification(options: {
  scope: UserMeScope
  email: string
}): Promise<void> {
  const body: SendEmailVerificationRequest = { email: options.email }
  await axiosInstance.post(
    `${getSelfBasePath(options.scope)}/email/verification/send`,
    body
  )
}

export async function verifyUserEmailCode(options: {
  scope: UserMeScope
  email: string
  code: string
}): Promise<string> {
  const body: VerifyEmailCodeRequest = {
    email: options.email,
    code: options.code,
  }
  const response = await axiosInstance.post<
    CommonApiResponse<VerifyEmailCodeResponseDto>
  >(`${getSelfBasePath(options.scope)}/email/verification`, body)
  return response.data.data.sessionId
}

export async function updateUserEmail(options: {
  scope: UserMeScope
  sessionId: string
}): Promise<void> {
  const body: UpdateEmailRequest = { sessionId: options.sessionId }
  await axiosInstance.post(`${getSelfBasePath(options.scope)}/email`, body)
}

export async function deleteUserEmail(scope: UserMeScope): Promise<void> {
  await axiosInstance.delete(`${getSelfBasePath(scope)}/email`)
}

export async function withdrawUser(scope: UserMeScope): Promise<void> {
  await axiosInstance.delete(getSelfBasePath(scope))
}

export async function linkUserSocialAccount(options: {
  scope: UserMeScope
  request: LinkSocialAccountRequest
}): Promise<void> {
  await axiosInstance.post(
    `${getSocialBasePath(options.scope)}/link`,
    options.request
  )
}

export async function unlinkUserSocialAccount(options: {
  scope: UserMeScope
  provider: SocialProvider
}): Promise<void> {
  await axiosInstance.delete(
    `${getSocialBasePath(options.scope)}/unlink/${options.provider}`
  )
}

export async function getUserSocialStatus(
  scope: UserMeScope
): Promise<SocialAccountStatusDto[]> {
  const response = await axiosInstance.get<
    CommonApiResponse<SocialAccountStatusDto[]>
  >(`${getSocialBasePath(scope)}/status`)
  return response.data.data
}
