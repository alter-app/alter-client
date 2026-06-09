import type { LocationCluster } from '@/features/job-lookup-map/lib/groupPostingsByLocation'
import type { Posting } from '@/features/job-lookup-map/types/posting'

export type MapDisplayCluster = {
  latitude: number
  longitude: number
  count: number
  postings: Posting[]
}

/** 줌 16 이상이면 매장별 마커, 그보다 멀면 인근 마커 병합 */
const CLUSTER_BREAK_ZOOM = 16

function getMergeRadiusDegrees(zoom: number): number | null {
  if (zoom >= CLUSTER_BREAK_ZOOM) return null
  return 0.0012 * Math.pow(2, CLUSTER_BREAK_ZOOM - zoom)
}

function toDisplayCluster(cluster: LocationCluster): MapDisplayCluster {
  return {
    latitude: cluster.latitude,
    longitude: cluster.longitude,
    count: cluster.count,
    postings: cluster.postings,
  }
}

function mergeLocationClusters(group: LocationCluster[]): MapDisplayCluster {
  const postings = group.flatMap(item => item.postings)
  const count = postings.length

  if (count === 0) {
    const first = group[0]
    return {
      latitude: first.latitude,
      longitude: first.longitude,
      count: 0,
      postings: [],
    }
  }

  const latitude =
    group.reduce((sum, item) => sum + item.latitude * item.count, 0) / count
  const longitude =
    group.reduce((sum, item) => sum + item.longitude * item.count, 0) / count

  return { latitude, longitude, count, postings }
}

function findClusterRoot(parent: number[], index: number): number {
  if (parent[index] !== index) {
    parent[index] = findClusterRoot(parent, parent[index])
  }
  return parent[index]
}

function clusterByDistance(
  clusters: LocationCluster[],
  radiusDegrees: number
): MapDisplayCluster[] {
  if (clusters.length === 0) return []

  const parent = clusters.map((_, index) => index)

  for (let i = 0; i < clusters.length; i += 1) {
    for (let j = i + 1; j < clusters.length; j += 1) {
      const latDiff = clusters[i].latitude - clusters[j].latitude
      const lngDiff = clusters[i].longitude - clusters[j].longitude
      const distance = Math.hypot(latDiff, lngDiff)

      if (distance <= radiusDegrees) {
        const rootI = findClusterRoot(parent, i)
        const rootJ = findClusterRoot(parent, j)
        if (rootI !== rootJ) {
          parent[rootJ] = rootI
        }
      }
    }
  }

  const groups = new Map<number, LocationCluster[]>()

  for (let i = 0; i < clusters.length; i += 1) {
    const root = findClusterRoot(parent, i)
    const bucket = groups.get(root)
    if (bucket) {
      bucket.push(clusters[i])
    } else {
      groups.set(root, [clusters[i]])
    }
  }

  return Array.from(groups.values()).map(mergeLocationClusters)
}

export function clusterMapMarkersForZoom(
  clusters: LocationCluster[],
  zoom: number
): MapDisplayCluster[] {
  if (clusters.length === 0) return []

  const mergeRadius = getMergeRadiusDegrees(zoom)
  if (mergeRadius === null) {
    return clusters.map(toDisplayCluster)
  }

  return clusterByDistance(clusters, mergeRadius)
}
