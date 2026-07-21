import { useQuery } from '@tanstack/react-query'

import { fetchPostingFilterOptions } from '@/features/job-lookup-map/api/posting'

export function usePostingFilterOptions(enabled = true) {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['jobLookupMap', 'filterOptions'] as const,
    queryFn: fetchPostingFilterOptions,
    enabled,
  })

  return {
    filterOptions: data,
    provinces: data?.provinces ?? [],
    districts: data?.districts ?? [],
    towns: data?.towns ?? [],
    sortOptions: data?.sortOptions ?? [],
    isLoading: isPending,
    isFetching,
    isError,
    refetch,
  }
}
