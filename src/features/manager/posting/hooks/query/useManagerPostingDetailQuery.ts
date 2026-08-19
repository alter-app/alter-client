import { useQuery } from '@tanstack/react-query'

import { fetchManagerPostingDetail } from '@/features/manager/posting/api/posting'
import { adaptPostingDetail } from '@/features/manager/posting/types/dto'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useManagerPostingDetailQuery(postingId: number) {
  const isValidId = Number.isInteger(postingId) && postingId > 0

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.posting.detail(postingId),
    queryFn: () => fetchManagerPostingDetail(postingId),
    enabled: isValidId,
    select: adaptPostingDetail,
  })

  return {
    posting: data ?? null,
    isLoading: isValidId && isPending,
    isError: !isValidId || isError,
  }
}
