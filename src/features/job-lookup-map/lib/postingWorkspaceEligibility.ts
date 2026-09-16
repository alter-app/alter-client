import { getMyWorkspaces } from '@/features/user/home/workspace/api/workspace'

const PAGE_SIZE = 10

export async function isEmployedAtWorkspace(
  workspaceId: number
): Promise<boolean> {
  const seenCursors = new Set<string>()
  let cursor: string | undefined

  do {
    const response = await getMyWorkspaces({ pageSize: PAGE_SIZE, cursor })
    if (
      response.data.data.some(
        workspace => workspace.workspaceId === workspaceId
      )
    ) {
      return true
    }

    cursor = response.data.page.cursor || undefined
    if (cursor && seenCursors.has(cursor)) {
      throw new Error('근무 업장 목록을 끝까지 확인하지 못했습니다.')
    }
    if (cursor) seenCursors.add(cursor)
  } while (cursor)

  return false
}
