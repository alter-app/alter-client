import { useQuery } from '@tanstack/react-query'

import { fetchPostingApplicationDetail } from '@/features/manager/posting/api/application'
import { adaptApplicationDetail } from '@/features/manager/posting/types/dto'
import { queryKeys } from '@/shared/lib/queryKeys'

export function usePostingApplicationDetailQuery(postingApplicationId: number) {
  const isValidId =
    Number.isInteger(postingApplicationId) && postingApplicationId > 0

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.posting.applicationDetail(postingApplicationId),
    queryFn: () => fetchPostingApplicationDetail(postingApplicationId),
    enabled: isValidId,
    select: adaptApplicationDetail,
  })

  return {
    application: data ?? null,
    isLoading: isValidId && isPending,
    isError: !isValidId || isError,
  }
}
