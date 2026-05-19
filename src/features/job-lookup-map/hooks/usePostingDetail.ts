import { useQuery } from '@tanstack/react-query'
import { fetchPostingDetail } from '@/features/job-lookup-map/api/posting'

export function usePostingDetail(postingId: number | undefined) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['postingDetail', postingId] as const,
    queryFn: () => fetchPostingDetail(postingId!),
    enabled: postingId != null && postingId > 0,
  })

  return { data, isPending, isError }
}
