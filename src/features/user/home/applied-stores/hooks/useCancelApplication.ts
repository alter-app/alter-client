import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelJobApplication } from '@/features/user/home/applied-stores/api/application'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useCancelApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: number) => cancelJobApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.application.list() })
    },
  })
}
