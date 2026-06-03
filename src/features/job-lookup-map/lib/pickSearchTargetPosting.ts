import { hasValidCoordinates } from '@/features/job-lookup-map/lib/moveMapToWorkspace'
import type { Posting } from '@/features/job-lookup-map/types/posting'

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '')
}

function matchScore(keyword: string, posting: Posting): number {
  const name = normalizeText(posting.workspace.businessName)
  const title = normalizeText(posting.title)

  if (!name && !title) return 0
  if (name === keyword) return 100
  if (name.includes(keyword))
    return 80 + Math.min(keyword.length / name.length, 1) * 15
  if (keyword.includes(name) && name.length >= 2) return 70
  if (title.includes(keyword)) return 55
  if (keyword.includes(title) && title.length >= 2) return 45
  return 0
}

function filterByKeyword(keyword: string, postings: Posting[]): Posting[] {
  const matched = postings.filter(posting => matchScore(keyword, posting) > 0)
  return matched.length > 0 ? matched : postings
}

export function pickSearchTargetPosting(
  keyword: string,
  postings: Posting[]
): Posting | undefined {
  const normalizedKeyword = normalizeText(keyword)
  if (!normalizedKeyword) return undefined

  const candidates = filterByKeyword(normalizedKeyword, postings).filter(
    posting =>
      hasValidCoordinates(
        posting.workspace.latitude,
        posting.workspace.longitude
      )
  )

  if (candidates.length === 0) return undefined

  let best = candidates[0]
  let bestScore = matchScore(normalizedKeyword, best)

  for (let i = 1; i < candidates.length; i += 1) {
    const posting = candidates[i]
    const score = matchScore(normalizedKeyword, posting)

    if (score > bestScore) {
      best = posting
      bestScore = score
    } else if (
      score === bestScore &&
      posting.workspace.id !== best.workspace.id
    ) {
      // 동점이면 매장명이 더 짧고 검색어에 가까운 쪽(보통 정확한 지점명)
      const bestNameLen = normalizeText(best.workspace.businessName).length
      const nextNameLen = normalizeText(posting.workspace.businessName).length
      if (nextNameLen < bestNameLen) {
        best = posting
      }
    }
  }

  return bestScore > 0 ? best : candidates[0]
}
