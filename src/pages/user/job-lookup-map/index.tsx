import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { animate, motion, useMotionValue } from 'framer-motion'
import { AlbaFindCategoryBar } from '@/features/job-lookup-map/common/AlbaFindCategoryBar'
import { ROUTES } from '@/shared/constants/routes'
import type {
  AlbaFindFilterId,
  AlbaFindMode,
} from '@/features/job-lookup-map/common/AlbaFindCategoryBar'
import { AlbaFindList } from '@/features/job-lookup-map/common/AlbaFindList'
import { Albabox } from '@/features/job-lookup-map/common/Albabox'
import { usePostings } from '@/features/job-lookup-map/hooks/usePosting'
import { postingToAlbaboxProps } from '@/features/job-lookup-map/lib/postingToAlbaboxProps'
import { MapFloatingActions } from '@/features/job-lookup-map/common/MapFloatingActions'
import { SearchBar } from '@/shared/ui/common/SearchBar'

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
const SHEET_PEEK_HEIGHT = 80

export function JobLookupMapPage() {
  const navigate = useNavigate()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<NaverMapInstance | null>(null)
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [maxTranslateY, setMaxTranslateY] = useState(0)
  const [mode, setMode] = useState<AlbaFindMode>('nearby')
  const [activeFilter, setActiveFilter] = useState<AlbaFindFilterId>('sort')
  const [bookmarkById, setBookmarkById] = useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)

  const { postings, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostings()

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '120px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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
    mapInstanceRef.current = map

    const geo = navigator.geolocation
    if (!geo) {
      return () => {
        mapInstanceRef.current = null
        map.destroy()
      }
    }

    const watchId = geo.watchPosition(
      pos => {
        lastPositionRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
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
      mapInstanceRef.current = null
      map.destroy()
    }
  }, [])

  const handleMyLocationClick = () => {
    const nmaps = getNaverMaps()
    const map = mapInstanceRef.current
    const pos = lastPositionRef.current
    if (!nmaps || !map || !pos) return
    map.setCenter(new nmaps.LatLng(pos.lat, pos.lng))
  }

  const handleListClick = () => {
    snapTo(0)
  }

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

      <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto max-w-[428px] px-4 pt-4">
        <div className="pointer-events-auto">
          <SearchBar
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(30px+80px+1rem)] z-[35] mx-auto flex max-w-[428px] justify-end px-4">
        <MapFloatingActions
          onListClick={handleListClick}
          onMyLocationClick={handleMyLocationClick}
        />
      </div>

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
        className="absolute inset-x-0 bottom-[30px] z-[40] mx-auto flex h-[calc(100dvh-78px)] max-h-[calc(100dvh-78px)] w-full max-w-[428px] flex-col overflow-hidden rounded-t-[32px] border border-line-2 border-b-0 bg-white"
      >
        <div className="mx-auto mt-4 h-1 w-[50px] shrink-0 rounded-full bg-line-2" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-[calc(1.5rem+78px+env(safe-area-inset-bottom))] pt-3">
          <AlbaFindCategoryBar
            mode={mode}
            onModeChange={setMode}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <AlbaFindList className="mt-3 min-h-0 flex-1 gap-0">
            {postings.map(posting => {
              const base = postingToAlbaboxProps(posting)
              const saved = bookmarkById[posting.id] ?? posting.scrapped
              return (
                <Albabox
                  key={posting.id}
                  {...base}
                  saved={saved}
                  onBookmarkClick={() =>
                    setBookmarkById(prev => ({
                      ...prev,
                      [posting.id]: !saved,
                    }))
                  }
                  onClick={() =>
                    navigate(
                      generatePath(ROUTES.USER.JOB_LOOKUP_MAP_DETAIL, {
                        postingId: String(posting.id),
                      })
                    )
                  }
                />
              )
            })}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="typography-body02-regular flex min-h-10 items-center justify-center py-3 text-text-50"
                aria-hidden
              >
                {isFetchingNextPage ? '더 불러오는 중…' : ''}
              </div>
            )}
          </AlbaFindList>
        </div>
      </motion.section>
    </div>
  )
}

export default JobLookupMapPage
