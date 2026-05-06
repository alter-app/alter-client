import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate, motion, useMotionValue } from 'framer-motion'
import { AlbaFindCategoryBar } from '@/features/job-lookup-map/common/AlbaFindCategoryBar'
import { ROUTES } from '@/shared/constants/routes'
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
    options?: {
      center?: object
      zoom?: number
      logoControl?: boolean
      scaleControl?: boolean
      mapDataControl?: boolean
    }
  ) => NaverMapInstance
  LatLng: new (lat: number, lng: number) => object
}

function getNaverMaps(): NaverMapsApi | undefined {
  return (window as Window & { naver?: { maps: NaverMapsApi } }).naver?.maps
}

/** 위치 권한 거부·오류 시 임시 중심 (서울시청 근처) */
const FALLBACK_LAT = 37.5665
const FALLBACK_LNG = 126.978
const SHEET_PEEK_HEIGHT = 20

export function JobLookupMapPage() {
  const navigate = useNavigate()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [maxTranslateY, setMaxTranslateY] = useState(0)
  const [mode, setMode] = useState<AlbaFindMode>('nearby')
  const [activeFilter, setActiveFilter] = useState<AlbaFindFilterId>('sort')
  const [savedDemo, setSavedDemo] = useState(false)
  const y = useMotionValue(0)

  useEffect(() => {
    const el = mapContainerRef.current
    if (!el) return

    const nmaps = getNaverMaps()
    if (!nmaps) return

    const fallback = new nmaps.LatLng(FALLBACK_LAT, FALLBACK_LNG)
    const map = new nmaps.Map(el, {
      center: fallback,
      zoom: 16,
      logoControl: false,
      scaleControl: false,
      mapDataControl: false,
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

  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return

    const updateBounds = () => {
      const nextMax = Math.max(0, sheet.offsetHeight - SHEET_PEEK_HEIGHT)
      setMaxTranslateY(nextMax)
      y.set(nextMax)
    }

    updateBounds()

    const observer = new ResizeObserver(updateBounds)
    observer.observe(sheet)
    window.addEventListener('resize', updateBounds)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBounds)
    }
  }, [y])

  const snapTo = (target: number) => {
    animate(y, target, {
      type: 'spring',
      stiffness: 380,
      damping: 38,
      mass: 0.8,
    })
  }

  return (
    <div className="relative flex h-screen flex-col bg-white">
      <div
        ref={mapContainerRef}
        className="h-full w-full shrink-0"
        aria-label="일자리 지도"
      />

      <motion.section
        ref={sheetRef}
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: maxTranslateY }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const current = y.get()
          const shouldExpand =
            info.velocity.y < -120 || current < maxTranslateY * 0.5
          snapTo(shouldExpand ? 0 : maxTranslateY)
        }}
        className="absolute inset-x-0 bottom-[30px] z-[40] mx-auto flex max-h-[calc(100dvh-78px)] w-full max-w-[428px] flex-col rounded-t-[32px] border border-line-2 border-b-0 bg-white"
      >
        <div className="mx-auto mt-4 h-1 w-[50px] rounded-full bg-line-2" />

        <div className="px-4 pb-[calc(1.5rem+78px+env(safe-area-inset-bottom))] pt-3">
          <AlbaFindCategoryBar
            mode={mode}
            onModeChange={setMode}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <AlbaFindList className="mt-3 gap-0">
            <Albabox
              storeName="출근하기 싫은 가게 고척점"
              title="[가게이름] 평일 저녁 마감 근무자 모집"
              wageAmount="10,030"
              timeRange="07:00 ~ 13:00"
              workDays="월, 화, 수"
              distance="800m"
              postedAgo="12시간 전"
              saved={savedDemo}
              likeCount="999+"
              onBookmarkClick={() => setSavedDemo(v => !v)}
              onClick={() => navigate(ROUTES.USER.JOB_LOOKUP_MAP_DETAIL)}
            />
            <Albabox
              storeName="출근하기 싫은 가게 고척점"
              title="[가게이름] 평일 저녁 마감 근무자 모집"
              wageAmount="10,030"
              timeRange="07:00 ~ 13:00"
              workDays="월, 화, 수"
              distance="800m"
              postedAgo="1일 전"
              likeCount="999+"
              saved
            />
            <Albabox
              storeName="출근하기 싫은 가게 고척점"
              title="[가게이름] 평일 저녁 마감 근무자 모집"
              wageAmount="10,030"
              timeRange="07:00 ~ 13:00"
              workDays="월, 화, 수"
              distance="800m"
              postedAgo="1일 전"
              likeCount="999+"
              saved={false}
            />
          </AlbaFindList>
        </div>
      </motion.section>
    </div>
  )
}

export default JobLookupMapPage
