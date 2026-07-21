import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeFavoritePosting } from '@/features/job-lookup-map/api/posting'

export function useRemoveFavoritePosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postingId: number) => removeFavoritePosting(postingId),
    onSuccess: (_, postingId) => {
      void queryClient.invalidateQueries({
        queryKey: ['jobLookupMap', 'favoritePostings'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['jobLookupMap', 'postings'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['postingDetail', postingId],
      })
    },
  })
}
