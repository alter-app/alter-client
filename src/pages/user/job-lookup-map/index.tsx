import { useEffect, useRef, useState } from 'react'

import { AlbaFindCategoryBar } from '@/features/job-lookup-map/common/AlbaFindCategoryBar'
import type {
  AlbaFindFilterId,
  AlbaFindMode,
} from '@/features/job-lookup-map/common/AlbaFindCategoryBar'
import { AlbaFindList } from '@/features/job-lookup-map/common/AlbaFindList'
import { Albabox } from '@/features/job-lookup-map/common/Albabox'

type NaverMapInstance = {
  destroy(): void
  setCenter(latlng: object): void
}

type NaverMapsApi = {
  Map: new (
    element: HTMLElement,
    options?: { center?: object; zoom?: number }
  ) => NaverMapInstance
  LatLng: new (lat: number, lng: number) => object
}

function getNaverMaps(): NaverMapsApi | undefined {
  return (window as Window & { naver?: { maps: NaverMapsApi } }).naver?.maps
}

/** 위치 권한 거부·오류 시 임시 중심 (서울시청 근처) */
const FALLBACK_LAT = 37.5665
const FALLBACK_LNG = 126.978

export function JobLookupMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<AlbaFindMode>('nearby')
  const [activeFilter, setActiveFilter] = useState<AlbaFindFilterId>('sort')
  const [savedDemo, setSavedDemo] = useState(false)

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return

    const nmaps = getNaverMaps()
    if (!nmaps) return

    const fallback = new nmaps.LatLng(FALLBACK_LAT, FALLBACK_LNG)
    const map = new nmaps.Map(el, {
      center: fallback,
      zoom: 16,
    })

    const geo = navigator.geolocation
    if (!geo) {
      return () => {
        map.destroy()
      }
    }

    const watchId = geo.watchPosition(
      pos => {
        map.setCenter(
          new nmaps.LatLng(pos.coords.latitude, pos.coords.longitude)
        )
      },
      undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 15_000,
      }
    )

    return () => {
      geo.clearWatch(watchId)
      map.destroy()
    }
  }, [])

  return (
    <div className="box-border flex h-[100dvh] flex-col bg-white">
      <div
        ref={mapContainerRef}
        className="h-[42dvh] min-h-[200px] w-full shrink-0"
        aria-label="일자리 지도"
      />

      <section className="flex min-h-0 flex-1 flex-col gap-3 border-t border-line-2 bg-bg-dark px-4 py-4">
        <AlbaFindCategoryBar
          mode={mode}
          onModeChange={setMode}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <AlbaFindList className="gap-3">
          <Albabox
            storeName="스타벅스 강남점"
            title="주말 오전 카페 알바 모집 (경력 무관)"
            wageAmount="12,000"
            timeRange="09:00–14:00"
            workDays="토·일"
            distance="도보 3분"
            postedAgo="1시간 전"
            saved={savedDemo}
            likeCount="24"
            onBookmarkClick={() => setSavedDemo(v => !v)}
          />
          <Albabox
            storeName="이마트24 역삼점"
            title="야간 편의점 스태프 (주 3일 가능)"
            wageAmount="11,500"
            timeRange="22:00–06:00"
            workDays="협의"
            distance="도보 8분"
            postedAgo="어제"
            saved={false}
          />
        </AlbaFindList>
      </section>
    </div>
  )
}

export default JobLookupMapPage
