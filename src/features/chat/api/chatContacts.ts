import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type { ChatContact } from '@/features/chat/types/chat'
import type { ChatApiScope } from '@/features/chat/api/chatRoom'

/**
 * 새 채팅 상대 후보 조회.
 * 채팅 전용 엔드포인트가 아직 없어 기존 업장 멤버 API를 스코프별로 조합합니다.
 * - USER: 같은 근무지의 동료(알바생) + 점주
 * - MANAGER: 소속 업장의 알바생
 */

const MEMBER_PAGE_SIZE = 100

/** 재직 중인 근무자 — 매니저 홈 목록(`useManagerHomeViewModel`)과 같은 값을 씁니다 */
const WORKER_STATUS_ACTIVE = 'ACTIVATED'

interface CursorBody<T> {
  page: { cursor: string | null; pageSize: number; totalCount: number }
  data: T[]
}

interface MemberPersonDto {
  id: number
  name: string
  profileImageUrl?: string | null
}

interface UserWorkspaceItemDto {
  workspaceId: number
  businessName: string
}

interface ManagerWorkspaceItemDto {
  id: number
  businessName: string
}

function toContact(
  person: MemberPersonDto,
  scope: 'USER' | 'MANAGER',
  workspaceName: string
): ChatContact {
  return {
    key: `${scope}:${person.id}`,
    id: person.id,
    scope,
    name: person.name,
    profileImageUrl: person.profileImageUrl ?? null,
    workspaceName,
  }
}

/**
 * 업장별 조회를 병렬로 돌리되 일부 실패는 건너뜁니다.
 * `Promise.all` 이면 업장 하나가 4xx 를 뱉을 때 연락처 목록 전체가 빈 화면이 됩니다.
 */
async function settleWorkspaceContacts(
  tasks: Promise<ChatContact[]>[]
): Promise<ChatContact[]> {
  const results = await Promise.allSettled(tasks)
  const succeeded = results.filter(
    (result): result is PromiseFulfilledResult<ChatContact[]> =>
      result.status === 'fulfilled'
  )

  // 전부 실패했다면 진짜 장애이므로 첫 에러를 그대로 올려 에러 화면을 띄웁니다
  if (succeeded.length === 0 && results.length > 0) {
    throw (results[0] as PromiseRejectedResult).reason
  }

  return succeeded.flatMap(result => result.value)
}

/** 중복 인물(여러 업장에 함께 근무)은 첫 업장 기준으로 한 번만 노출합니다 */
function dedupeContacts(contacts: ChatContact[]): ChatContact[] {
  const seen = new Set<string>()
  return contacts.filter(contact => {
    if (seen.has(contact.key)) return false
    seen.add(contact.key)
    return true
  })
}

async function fetchUserContacts(): Promise<ChatContact[]> {
  const workspacesResponse = await axiosInstance.get<
    CommonApiResponse<CursorBody<UserWorkspaceItemDto>>
  >('/app/users/me/workspaces', { params: { pageSize: MEMBER_PAGE_SIZE } })

  const workspaces = workspacesResponse.data.data.data

  const perWorkspace = await settleWorkspaceContacts(
    workspaces.map(async workspace => {
      const [workers, managers] = await Promise.all([
        axiosInstance.get<
          CommonApiResponse<CursorBody<{ user: MemberPersonDto }>>
        >(`/app/users/me/workspaces/${workspace.workspaceId}/workers`, {
          params: { pageSize: MEMBER_PAGE_SIZE },
        }),
        axiosInstance.get<
          CommonApiResponse<CursorBody<{ manager: MemberPersonDto }>>
        >(`/app/users/me/workspaces/${workspace.workspaceId}/managers`, {
          params: { pageSize: MEMBER_PAGE_SIZE },
        }),
      ])

      return [
        ...managers.data.data.data.map(item =>
          toContact(item.manager, 'MANAGER', workspace.businessName)
        ),
        ...workers.data.data.data.map(item =>
          toContact(item.user, 'USER', workspace.businessName)
        ),
      ]
    })
  )

  return dedupeContacts(perWorkspace)
}

async function fetchManagerContacts(): Promise<ChatContact[]> {
  const workspacesResponse = await axiosInstance.get<
    CommonApiResponse<ManagerWorkspaceItemDto[]>
  >('/manager/workspaces')

  const workspaces = workspacesResponse.data.data

  const perWorkspace = await settleWorkspaceContacts(
    workspaces.map(async workspace => {
      const workers = await axiosInstance.get<
        CommonApiResponse<CursorBody<{ user: MemberPersonDto }>>
      >(`/manager/workspaces/${workspace.id}/workers`, {
        // 퇴사자 제외 — 서버 enum 은 EMPLOYED 가 아니라 ACTIVATED 입니다
        params: { pageSize: MEMBER_PAGE_SIZE, status: WORKER_STATUS_ACTIVE },
      })

      return workers.data.data.data.map(item =>
        toContact(item.user, 'USER', workspace.businessName)
      )
    })
  )

  return dedupeContacts(perWorkspace)
}

export async function fetchChatContacts(
  scope: ChatApiScope
): Promise<ChatContact[]> {
  return scope === 'MANAGER' ? fetchManagerContacts() : fetchUserContacts()
}
