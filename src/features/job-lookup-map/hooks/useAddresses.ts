import { useQuery } from '@tanstack/react-query'

import { fetchAddresses } from '@/features/job-lookup-map/api/posting'

export function useAddresses(code?: string, enabled = true) {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['jobLookupMap', 'addresses', code ?? 'root'] as const,
    queryFn: () => fetchAddresses(code),
    enabled,
  })

  return {
    addresses: data ?? [],
    isLoading: isPending,
    isFetching,
    isError,
    refetch,
  }
}
