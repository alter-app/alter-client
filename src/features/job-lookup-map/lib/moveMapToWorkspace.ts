import {
  getNaverMaps,
  type NaverMapInstance,
} from '@/features/job-lookup-map/lib/naverMaps'
import type { Workspace } from '@/features/job-lookup-map/types/posting'

export function hasValidCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0)
  )
}

export function moveMapToWorkspace(
  map: NaverMapInstance,
  workspace: Pick<Workspace, 'latitude' | 'longitude'>
): boolean {
  const { latitude, longitude } = workspace
  if (!hasValidCoordinates(latitude, longitude)) return false

  const nmaps = getNaverMaps()
  if (!nmaps) return false

  map.setCenter(new nmaps.LatLng(latitude, longitude))
  return true
}
