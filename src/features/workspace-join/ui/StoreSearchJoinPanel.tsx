import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  searchStoresForApply,
  requestJoinWorkspace,
} from '@/features/workspace-join/api/workspaceJoin'
import { getAxiosErrorMessage } from '@/features/workspace-join/api/membership'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { DiscoverableStoreRow } from '@/features/workspace-join/types'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'

type Props = {
  onApplied: (payload: DiscoverableStoreRow) => void
}

export function StoreSearchJoinPanel({ onApplied }: Props) {
  const queryClient = useQueryClient()

  const [keyword, setKeyword] = useState('')
  const [rows, setRows] = useState<DiscoverableStoreRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const trimmed = keyword.trim()
  const canSearch = trimmed.length >= 2

  const search = async () => {
    if (!canSearch || loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await searchStoresForApply(trimmed)
      setRows(result)
      setHasSearched(true)
    } catch (e) {
      setHasSearched(true)
      setError(
        getAxiosErrorMessage(e, '검색 결과를 불러오지 못했습니다.')
      )
    } finally {
      setLoading(false)
    }
  }

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [rows]
  )

  const applyRow = async (row: DiscoverableStoreRow) => {
    setError(null)
    try {
      await requestJoinWorkspace(row.workspaceId)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceMembership.all,
      })
      onApplied(row)
    } catch (e) {
      setError(
        getAxiosErrorMessage(e, '가입 신청에 실패했습니다.')
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-4 typography-body02-regular text-text-70">
          매장 이름·주소로 검색 후 가입을 신청해요. 사장님이 승인하면 근무 업장
          목록에 나타나요.
        </p>
        <div className="flex gap-2">
          <AuthInput
            type="search"
            placeholder="매장명 또는 동·로 검색"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') search()
            }}
          />
          <AuthButton
            type="button"
            disabled={!canSearch || loading}
            style={{
              flexShrink: 0,
              minWidth: '80px',
              opacity: canSearch && !loading ? 1 : 0.45,
            }}
            onClick={() => search()}
          >
            검색
          </AuthButton>
        </div>
        {error ?
          <p className="mt-3 typography-body02-regular text-red-600">{error}</p>
        : null}
      </div>

      {hasSearched && !loading && sorted.length === 0 && !error ?
        <p className="typography-body02-regular text-text-70">
          검색 결과가 없어요. 키워드를 바꿔 보거나 받은 업장 초대를 확인해
          보세요.
        </p>
      : null}

      {loading ?
        <p className="typography-body02-regular text-text-70">검색 중이에요…</p>
      : null}

      <ul className="flex flex-col gap-2">
        {sorted.map(row => (
          <li
            key={row.workspaceId}
            className="flex flex-col gap-2 rounded-2xl border border-line-2 bg-white px-4 py-3"
          >
            <div>
              <p className="typography-body01-semibold text-text-100">
                {row.displayName}
              </p>
              <p className="mt-1 typography-body02-regular text-text-70">
                {row.roadAddressSummary}
              </p>
            </div>
            <AuthButton
              type="button"
              style={{ width: '100%' }}
              onClick={() => applyRow(row)}
            >
              가입 신청
            </AuthButton>
          </li>
        ))}
      </ul>
    </div>
  )
}
