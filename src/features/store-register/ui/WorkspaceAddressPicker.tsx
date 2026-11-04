import { useEffect, useRef, useState } from 'react'
import {
  getNaverMaps,
  type NaverLatLng,
} from '@/features/job-lookup-map/lib/naverMaps'
import {
  reverseWorkspaceAddress,
  searchWorkspaceAddresses,
  type WorkspaceLocation,
} from '../lib/geocodeWorkspaceAddress'

type Props = {
  value: WorkspaceLocation | null
  onChange: (value: WorkspaceLocation | null) => void
  detailAddress: string
  onDetailChange: (value: string) => void
}
export function WorkspaceAddressPicker({
  value,
  onChange,
  detailAddress,
  onDetailChange,
}: Props) {
  // 제출할 주소와 지도 표시 위치를 분리해 조회 실패 시에도 재선택할 수 있게 합니다.
  const [mapLocation, setMapLocation] = useState(
    () => value && { latitude: value.latitude, longitude: value.longitude }
  )
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<WorkspaceLocation[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const element = useRef<HTMLDivElement>(null)
  const sequence = useRef(0)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(
    () => () => {
      sequence.current++
    },
    []
  )
  const choose = (location: WorkspaceLocation) => {
    sequence.current++
    setBusy(false)
    setError('')
    setResults([])
    setMapLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    })
    onChange(location)
  }
  async function search() {
    const id = ++sequence.current
    onChange(null)
    setBusy(true)
    setError('')
    setResults([])
    try {
      const found = await searchWorkspaceAddresses(query)
      if (id !== sequence.current) return
      setResults(found)
      if (!found.length)
        setError(
          '검색 결과가 없습니다. 층·호수를 제외한 도로명 또는 지번 주소를 입력해 주세요.'
        )
    } catch (e) {
      if (id === sequence.current)
        setError(e instanceof Error ? e.message : '주소 검색에 실패했습니다.')
    } finally {
      if (id === sequence.current) setBusy(false)
    }
  }
  useEffect(() => {
    const api = getNaverMaps()
    if (!api || !element.current || !mapLocation) return
    const center = new api.LatLng(mapLocation.latitude, mapLocation.longitude)
    const map = new api.Map(element.current, { center, zoom: 17 })
    const marker = new api.Marker({ position: center, map })
    const listener = api.Event.addListener(
      map,
      'click',
      async (event?: { coord: NaverLatLng }) => {
        if (!event) return
        const id = ++sequence.current
        setMapLocation({
          latitude: event.coord.lat(),
          longitude: event.coord.lng(),
        })
        setResults([])
        onChangeRef.current(null)
        setBusy(true)
        setError('')
        try {
          const next = await reverseWorkspaceAddress(
            event.coord.lat(),
            event.coord.lng()
          )
          if (id === sequence.current) {
            onChangeRef.current(next)
            setResults([])
          }
        } catch (e) {
          if (id === sequence.current)
            setError(
              e instanceof Error ? e.message : '주소 조회에 실패했습니다.'
            )
        } finally {
          if (id === sequence.current) setBusy(false)
        }
      }
    )
    return () => {
      api.Event.removeListener(listener)
      marker.setMap(null)
      map.destroy()
    }
  }, [mapLocation])
  return (
    <section className="flex flex-col gap-3" aria-label="업장 주소">
      <label
        htmlFor="workspace-address-query"
        className="typography-body02-semibold"
      >
        주소 검색
      </label>
      <div className="flex gap-2">
        <input
          id="workspace-address-query"
          className="min-w-0 flex-1 rounded-lg border border-line-2 p-3"
          placeholder="도로명 또는 지번 주소"
          value={query}
          onChange={e => {
            sequence.current++
            setBusy(false)
            setQuery(e.target.value)
            setResults([])
            setError('')
            onChange(null)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && query.trim() && !busy) {
              e.preventDefault()
              void search()
            }
          }}
        />
        <button
          type="button"
          className="rounded-lg bg-main px-4 text-white disabled:opacity-45"
          disabled={!query.trim() || busy}
          onClick={() => void search()}
        >
          검색
        </button>
      </div>
      {busy && <p role="status">주소 확인 중…</p>}
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      <ul className="max-h-64 overflow-y-auto">
        {results.map((item, i) => (
          <li key={`${item.jibunAddress}-${i}`}>
            <button
              type="button"
              className="w-full border-b border-line-2 p-3 text-left"
              onClick={() => choose(item)}
            >
              <div>{item.roadAddress ?? item.jibunAddress}</div>
              <div className="text-sm text-text-70">
                지번: {item.jibunAddress}
              </div>
            </button>
          </li>
        ))}
      </ul>
      {value && (
        <>
          <p className="text-sm">
            도로명: {value.roadAddress ?? '도로명 주소 없음'}
            <br />
            지번: {value.jibunAddress}
          </p>
          <p className="text-sm text-text-70">
            지도에서 건물 위치를 누르면 주소가 다시 조회됩니다.
          </p>
        </>
      )}
      <div
        ref={element}
        className={mapLocation ? 'h-60 w-full rounded-xl' : 'hidden'}
        aria-label="업장 위치 선택 지도"
      />
      <label
        htmlFor="workspace-detail-address"
        className="typography-body02-semibold"
      >
        상세주소 (선택)
      </label>
      <input
        id="workspace-detail-address"
        className="rounded-lg border border-line-2 p-3"
        placeholder="예: 2층 202호"
        value={detailAddress}
        onChange={e => onDetailChange(e.target.value)}
      />
    </section>
  )
}
