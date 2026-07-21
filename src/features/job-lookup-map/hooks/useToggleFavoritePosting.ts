import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addFavoritePosting,
  removeFavoritePosting,
} from '@/features/job-lookup-map/api/posting'

function invalidateFavoriteQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  postingId: number
) {
  void queryClient.invalidateQueries({
    queryKey: ['jobLookupMap', 'favoritePostings'],
  })
  void queryClient.invalidateQueries({
    queryKey: ['jobLookupMap', 'postings'],
  })
  void queryClient.invalidateQueries({
    queryKey: ['postingDetail', postingId],
  })
}

export function useToggleFavoritePosting() {
  const queryClient = useQueryClient()
  const inFlightIdsRef = useRef(new Set<number>())

  const addMutation = useMutation({
    mutationFn: (postingId: number) => addFavoritePosting(postingId),
    onSuccess: (_, postingId) => {
      invalidateFavoriteQueries(queryClient, postingId)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (postingId: number) => removeFavoritePosting(postingId),
    onSuccess: (_, postingId) => {
      invalidateFavoriteQueries(queryClient, postingId)
    },
  })

  const toggleFavorite = (params: {
    postingId: number
    saved: boolean
    onOptimistic?: (nextSaved: boolean) => void
    onError?: (rollbackSaved: boolean) => void
    onSettled?: () => void
  }) => {
    const { postingId, saved, onOptimistic, onError, onSettled } = params
    if (inFlightIdsRef.current.has(postingId)) return false

    inFlightIdsRef.current.add(postingId)
    const nextSaved = !saved
    onOptimistic?.(nextSaved)

    const mutate = saved ? removeMutation.mutate : addMutation.mutate
    mutate(postingId, {
      onError: () => onError?.(saved),
      onSettled: () => {
        inFlightIdsRef.current.delete(postingId)
        onSettled?.()
      },
    })
    return true
  }

  return {
    toggleFavorite,
    isPending: addMutation.isPending || removeMutation.isPending,
  }
}
