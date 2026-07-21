import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addFavoritePosting } from '@/features/job-lookup-map/api/posting'

export function useAddFavoritePosting() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postingId: number) => addFavoritePosting(postingId),
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
