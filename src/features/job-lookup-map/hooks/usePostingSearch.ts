import { useCallback } from 'react'
import { fetchPostings } from '@/features/job-lookup-map/api/posting'
import type { Posting } from '@/features/job-lookup-map/types/posting'

const SEARCH_PAGE_SIZE = 20

export function usePostingSearch() {
  const search = useCallback(async (keyword: string): Promise<Posting[]> => {
    const trimmed = keyword.trim()
    if (!trimmed) return []

    try {
      const response = await fetchPostings({
        pageSize: SEARCH_PAGE_SIZE,
        searchKeyword: trimmed,
      })
      return response.data ?? []
    } catch {
      return []
    }
  }, [])

  return { search }
}
