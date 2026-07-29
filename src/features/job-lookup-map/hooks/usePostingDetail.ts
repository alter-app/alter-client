import { useQuery } from '@tanstack/react-query'
import { fetchPostingDetail } from '@/features/job-lookup-map/api/posting'

export function usePostingDetail(postingId: number | undefined) {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['postingDetail', postingId] as const,
    queryFn: () => fetchPostingDetail(postingId!),
    enabled: postingId != null && postingId > 0,
    retry: false,
  })

  return { data, isLoading, isError, isFetching }
}
