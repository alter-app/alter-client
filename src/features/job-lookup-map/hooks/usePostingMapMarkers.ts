import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { Posting } from '@/features/job-lookup-map/types/posting'
import { clusterMapMarkersForZoom } from '@/features/job-lookup-map/lib/clusterMapMarkers'
import { groupPostingsByLocation } from '@/features/job-lookup-map/lib/groupPostingsByLocation'
import {
  createMarkerHtml,
  getMarkerSize,
} from '@/features/job-lookup-map/lib/postingMapMarker'
import {
  getNaverMaps,
  type NaverMapInstance,
  type NaverMarker,
} from '@/features/job-lookup-map/lib/naverMaps'

type UsePostingMapMarkersOptions = {
  mapRef: RefObject<NaverMapInstance | null>
  postings: Posting[]
  onClusterClick?: (postingIds: number[]) => void
}

export function usePostingMapMarkers({
  mapRef,
  postings,
  onClusterClick,
}: UsePostingMapMarkersOptions) {
  const markersRef = useRef<NaverMarker[]>([])
  const listenersRef = useRef<unknown[]>([])
  const onClusterClickRef = useRef(onClusterClick)
  const syncMarkersRef = useRef<() => void>(() => {})

  const clearMarkers = useCallback(() => {
    const nmaps = getNaverMaps()
    if (!nmaps) return

    for (const listener of listenersRef.current) {
      nmaps.Event.removeListener(listener)
    }
    listenersRef.current = []

    for (const marker of markersRef.current) {
      marker.setMap(null)
    }
    markersRef.current = []
  }, [])

  const syncMarkers = useCallback(() => {
    const nmaps = getNaverMaps()
    const map = mapRef.current
    if (!nmaps || !map) return

    clearMarkers()

    const locationClusters = groupPostingsByLocation(postings)
    const zoom = map.getZoom()
    const displayClusters = clusterMapMarkersForZoom(locationClusters, zoom)

    for (const cluster of displayClusters) {
      const size = getMarkerSize(cluster.count)
      const marker = new nmaps.Marker({
        position: new nmaps.LatLng(cluster.latitude, cluster.longitude),
        map,
        clickable: true,
        icon: {
          content: createMarkerHtml(cluster.count),
          anchor: new nmaps.Point(size / 2, size / 2),
        },
      })

      const listener = nmaps.Event.addListener(marker, 'click', () => {
        onClusterClickRef.current?.(cluster.postings.map(posting => posting.id))
      })

      listenersRef.current.push(listener)
      markersRef.current.push(marker)
    }
  }, [clearMarkers, mapRef, postings])

  useEffect(() => {
    onClusterClickRef.current = onClusterClick
  }, [onClusterClick])

  useEffect(() => {
    syncMarkersRef.current = syncMarkers

    const nmaps = getNaverMaps()
    const map = mapRef.current
    if (!nmaps || !map) {
      syncMarkers()
      return clearMarkers
    }

    syncMarkers()

    let zoomDebounceId: ReturnType<typeof setTimeout> | undefined
    const zoomListener = nmaps.Event.addListener(map, 'zoom_changed', () => {
      if (zoomDebounceId) clearTimeout(zoomDebounceId)
      zoomDebounceId = setTimeout(() => {
        syncMarkers()
      }, 80)
    })

    return () => {
      if (zoomDebounceId) clearTimeout(zoomDebounceId)
      nmaps.Event.removeListener(zoomListener)
      clearMarkers()
    }
  }, [clearMarkers, mapRef, syncMarkers])

  return { syncMarkersRef }
}
