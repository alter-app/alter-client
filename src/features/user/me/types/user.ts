export interface ReputationKeyword {
  id: string
  emoji: string
  description: string
  count: number
}

export interface ReputationSummary {
  topKeywords: ReputationKeyword[]
}

export interface UserMeDto {
  id: number
  name: string
  nickname: string
  createdAt: string
  email?: string | null
  contact?: string | null
  phone?: string | null
  profileImageUrl?: string | null
  reputationSummary?: ReputationSummary | null
}

export interface UserMeApiResponse {
  timestamp: string
  data: UserMeDto
}

export type UserMeScope = 'USER' | 'MANAGER'

export type SocialProvider = 'KAKAO' | 'APPLE'

export type SocialPlatformType = 'WEB' | 'NATIVE'

export interface UpdateNicknameRequest {
  nickname: string
}

export interface UpdateProfileImageRequest {
  fileId: string
}

export interface UpdatePasswordRequest {
  currentPassword?: string
  newPassword: string
}

export interface SendEmailVerificationRequest {
  email: string
}

export interface VerifyEmailCodeRequest {
  email: string
  code: string
}

export interface VerifyEmailCodeResponseDto {
  sessionId: string
}

export interface UpdateEmailRequest {
  sessionId: string
}

export interface LinkSocialAccountRequest {
  provider: SocialProvider
  platformType: SocialPlatformType
  oauthToken?: {
    accessToken: string
    refreshToken?: string
  }
  authorizationCode?: string
  redirectUri?: string
}

export interface SocialAccountStatusDto {
  provider: SocialProvider
  linked: boolean
  linkedAt?: string | null
}
