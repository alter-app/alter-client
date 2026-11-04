export type WorkspaceLocation = {
  roadAddress: string | null
  jibunAddress: string
  latitude: number
  longitude: number
  province: string
  district: string
  town: string
}
type Address = {
  x: string
  y: string
  roadAddress: string
  jibunAddress: string
  addressElements: { types: string[]; longName: string }[]
}
type Region = {
  area1: { name: string }
  area2: { name: string }
  area3: { name: string }
}
type Service = {
  Status: { OK: number }
  geocode(
    options: { query: string; count: number },
    callback: (
      status: number,
      response: { v2: { addresses: Address[] } }
    ) => void
  ): void
  reverseGeocode(
    options: { coords: { lat: number; lng: number }; orders: string },
    callback: (
      status: number,
      response: {
        v2: {
          address: { roadAddress: string; jibunAddress: string }
          results: { region: Region }[]
        }
      }
    ) => void
  ): void
}
function service(): Service {
  const api = (window as Window & { naver?: { maps?: { Service?: Service } } })
    .naver?.maps?.Service
  if (!api)
    throw new Error(
      '주소 검색을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'
    )
  return api
}
function request<T>(
  run: (done: (value: T) => void, fail: (error: Error) => void) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () =>
        reject(new Error('주소 검색이 지연되고 있습니다. 다시 시도해 주세요.')),
      10000
    )
    const done = (value: T) => {
      window.clearTimeout(timer)
      resolve(value)
    }
    const fail = (error: Error) => {
      window.clearTimeout(timer)
      reject(error)
    }
    try {
      run(done, fail)
    } catch (e) {
      fail(e instanceof Error ? e : new Error('주소 검색에 실패했습니다.'))
    }
  })
}
export function searchWorkspaceAddresses(
  query: string
): Promise<WorkspaceLocation[]> {
  return request((done, fail) => {
    const api = service()
    api.geocode({ query: query.trim(), count: 20 }, (status, response) => {
      if (status !== api.Status.OK) {
        fail(new Error('주소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.'))
        return
      }
      const items = (response?.v2?.addresses ?? []).filter(
        a =>
          a.x?.trim() &&
          a.y?.trim() &&
          Number.isFinite(Number(a.x)) &&
          Number.isFinite(Number(a.y)) &&
          Math.abs(Number(a.x)) <= 180 &&
          Math.abs(Number(a.y)) <= 90 &&
          a.jibunAddress
      )
      done(
        items.map(a => {
          const region = (type: string) =>
            a.addressElements?.find(e => e.types.includes(type))?.longName ?? ''
          return {
            roadAddress: a.roadAddress || null,
            jibunAddress: a.jibunAddress,
            latitude: Number(a.y),
            longitude: Number(a.x),
            province: region('SIDO'),
            district: region('SIGUGUN'),
            town: region('DONGMYUN'),
          }
        })
      )
    })
  })
}
export function reverseWorkspaceAddress(
  latitude: number,
  longitude: number
): Promise<WorkspaceLocation> {
  return request((done, fail) => {
    const api = service()
    api.reverseGeocode(
      { coords: { lat: latitude, lng: longitude }, orders: 'addr,roadaddr' },
      (status, response) => {
        const address = response?.v2?.address
        const region = response?.v2?.results?.[0]?.region
        if (status !== api.Status.OK || !address?.jibunAddress || !region) {
          fail(
            new Error(
              '선택한 위치의 주소를 찾지 못했습니다. 건물 위치를 다시 선택하거나 주소로 검색해 주세요.'
            )
          )
          return
        }
        done({
          latitude,
          longitude,
          roadAddress: address.roadAddress || null,
          jibunAddress: address.jibunAddress,
          province: region.area1.name,
          district: region.area2.name,
          town: region.area3.name,
        })
      }
    )
  })
}
