import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteUserEmail,
  deleteUserProfileImage,
  getUserSocialStatus,
  linkUserSocialAccount,
  sendUserEmailVerification,
  unlinkUserSocialAccount,
  updateUserEmail,
  updateUserNickname,
  updateUserPassword,
  updateUserProfileImage,
  verifyUserEmailCode,
  withdrawUser,
} from '@/features/user/me/api/user'
import type {
  LinkSocialAccountRequest,
  SocialProvider,
  UserMeScope,
} from '@/features/user/me/types/user'
import useAuthStore from '@/shared/stores/useAuthStore'
import { queryKeys } from '@/shared/lib/queryKeys'

function useCurrentUserScope(): UserMeScope {
  return useAuthStore(state => state.scope) ?? 'USER'
}

export function useUpdateNicknameMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nickname: string) => updateUserNickname({ scope, nickname }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me(scope) })
    },
  })
}

export function useUpdateProfileImageMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => updateUserProfileImage({ scope, fileId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me(scope) })
    },
  })
}

export function useDeleteProfileImageMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteUserProfileImage(scope),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me(scope) })
    },
  })
}

export function useUpdatePasswordMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (payload: { currentPassword?: string; newPassword: string }) =>
      updateUserPassword({ scope, ...payload }),
  })
}

export function useSendEmailVerificationMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (email: string) => sendUserEmailVerification({ scope, email }),
  })
}

export function useVerifyEmailCodeMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (payload: { email: string; code: string }) =>
      verifyUserEmailCode({ scope, ...payload }),
  })
}

export function useUpdateEmailMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => updateUserEmail({ scope, sessionId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me(scope) })
    },
  })
}

export function useDeleteEmailMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteUserEmail(scope),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.me(scope) })
    },
  })
}

export function useWithdrawUserMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: () => withdrawUser(scope),
  })
}

export function useUserSocialStatus() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  return useQuery({
    queryKey: queryKeys.user.socialStatus(scope),
    queryFn: () => getUserSocialStatus(scope ?? 'USER'),
    enabled: isLoggedIn && Boolean(scope),
    staleTime: 60_000,
  })
}

export function useLinkSocialAccountMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LinkSocialAccountRequest) =>
      linkUserSocialAccount({ scope, request }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user.socialStatus(scope),
      })
    },
  })
}

export function useUnlinkSocialAccountMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider: SocialProvider) =>
      unlinkUserSocialAccount({ scope, provider }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.user.socialStatus(scope),
      })
    },
  })
}
