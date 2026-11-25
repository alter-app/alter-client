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

function requireUserScope(scope: UserMeScope | null): UserMeScope {
  if (!scope) {
    throw new Error('사용자 권한 정보가 준비되지 않았습니다.')
  }
  return scope
}

function useCurrentUserScope(): UserMeScope | null {
  return useAuthStore(state => state.scope)
}

export function useUpdateNicknameMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nickname: string) =>
      updateUserNickname({ scope: requireUserScope(scope), nickname }),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.me(scope),
        })
      }
    },
  })
}

export function useUpdateProfileImageMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) =>
      updateUserProfileImage({ scope: requireUserScope(scope), fileId }),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.me(scope),
        })
      }
    },
  })
}

export function useDeleteProfileImageMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteUserProfileImage(requireUserScope(scope)),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.me(scope),
        })
      }
    },
  })
}

export function useUpdatePasswordMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (payload: { currentPassword?: string; newPassword: string }) =>
      updateUserPassword({ scope: requireUserScope(scope), ...payload }),
  })
}

export function useSendEmailVerificationMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (email: string) =>
      sendUserEmailVerification({ scope: requireUserScope(scope), email }),
  })
}

export function useVerifyEmailCodeMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: (payload: { email: string; code: string }) =>
      verifyUserEmailCode({ scope: requireUserScope(scope), ...payload }),
  })
}

export function useUpdateEmailMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) =>
      updateUserEmail({ scope: requireUserScope(scope), sessionId }),
    // 서버가 인증된 이메일을 소문자로 저장하므로 재조회를 기다린 뒤 성공으로 끝낸다.
    // 재조회가 실패해도(기본 재시도 후) 오류를 던지지 않아 성공으로 끝나며, 표시는 이전 값에 머문다.
    onSuccess: async () => {
      if (scope) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.user.me(scope),
        })
      }
    },
  })
}

export function useDeleteEmailMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteUserEmail(requireUserScope(scope)),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.me(scope),
        })
      }
    },
  })
}

export function useWithdrawUserMutation() {
  const scope = useCurrentUserScope()

  return useMutation({
    mutationFn: () => withdrawUser(requireUserScope(scope)),
  })
}

export function useUserSocialStatus() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  return useQuery({
    queryKey: queryKeys.user.socialStatus(scope),
    queryFn: () => getUserSocialStatus(requireUserScope(scope)),
    enabled: isLoggedIn && Boolean(scope),
    staleTime: 60_000,
  })
}

export function useLinkSocialAccountMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: LinkSocialAccountRequest) =>
      linkUserSocialAccount({ scope: requireUserScope(scope), request }),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.socialStatus(scope),
        })
      }
    },
  })
}

export function useUnlinkSocialAccountMutation() {
  const scope = useCurrentUserScope()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (provider: SocialProvider) =>
      unlinkUserSocialAccount({ scope: requireUserScope(scope), provider }),
    onSuccess: () => {
      if (scope) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.user.socialStatus(scope),
        })
      }
    },
  })
}
