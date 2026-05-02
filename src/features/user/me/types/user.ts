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
  reputationSummary?: ReputationSummary | null
}

export interface UserMeApiResponse {
  timestamp: string
  data: UserMeDto
}
