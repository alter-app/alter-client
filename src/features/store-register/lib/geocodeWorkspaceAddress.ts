type GeocodeResponse = {
  v2: { addresses: { x: string; y: string }[] }
}

type Geocoder = {
  Status: { OK: number }
  geocode(
    options: { query: string },
    callback: (status: number, response: GeocodeResponse) => void
  ): void
}

/** 주소를 찾지 못하면 임의의 좌표로 신청하지 않습니다. */
export function geocodeWorkspaceAddress(
  query: string
): Promise<{ latitude: number; longitude: number }> {
  const service = (
    window as Window & { naver?: { maps?: { Service?: Geocoder } } }
  ).naver?.maps?.Service
  if (!service) {
    return Promise.reject(
      new Error(
        '주소 검색을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'
      )
    )
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(
        new Error('주소 검색이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.')
      )
    }, 10000)
    try {
      service.geocode({ query }, (status, response) => {
        window.clearTimeout(timeout)
        if (status !== service.Status.OK) {
          reject(
            new Error('주소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.')
          )
          return
        }
        const addresses = response?.v2?.addresses ?? []
        if (addresses.length !== 1) {
          reject(
            new Error(
              '업장 위치를 특정할 수 없습니다. 시/도·구·동과 도로명 또는 지번 주소를 정확히 입력해 주세요.'
            )
          )
          return
        }
        const latitude = Number(addresses[0].y)
        const longitude = Number(addresses[0].x)
        if (
          !addresses[0].y.trim() ||
          !addresses[0].x.trim() ||
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          Math.abs(latitude) > 90 ||
          Math.abs(longitude) > 180
        ) {
          reject(
            new Error(
              '업장 좌표를 확인할 수 없습니다. 주소를 다시 확인해 주세요.'
            )
          )
          return
        }
        resolve({ latitude, longitude })
      })
    } catch {
      window.clearTimeout(timeout)
      reject(new Error('주소 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.'))
    }
  })
}
