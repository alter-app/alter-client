import type { Posting } from '@/features/job-lookup-map/types/posting'

export type LocationCluster = {
  workspaceId: number
  latitude: number
  longitude: number
  businessName: string
  postings: Posting[]
  count: number
}

export function groupPostingsByLocation(
  postings: Posting[]
): LocationCluster[] {
  const clusterMap = new Map<number, LocationCluster>()

  for (const posting of postings) {
    const { workspace } = posting
    const { latitude, longitude, id: workspaceId } = workspace

    if (
      latitude == null ||
      longitude == null ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      continue
    }

    const existing = clusterMap.get(workspaceId)
    if (existing) {
      existing.postings.push(posting)
      existing.count += 1
      continue
    }

    clusterMap.set(workspaceId, {
      workspaceId,
      latitude,
      longitude,
      businessName: workspace.businessName,
      postings: [posting],
      count: 1,
    })
  }

  return Array.from(clusterMap.values())
}
