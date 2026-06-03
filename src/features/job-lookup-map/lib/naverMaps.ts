export type NaverLatLng = {
  lat(): number
  lng(): number
}

export type NaverLatLngBounds = {
  getSW(): NaverLatLng
  getNE(): NaverLatLng
}

export type NaverMapInstance = {
  destroy(): void
  setCenter(latlng: object): void
  getBounds(): NaverLatLngBounds
}

export type NaverMarker = {
  setMap(map: NaverMapInstance | null): void
}

export type NaverMapsApi = {
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
  Marker: new (options: {
    position: object
    map?: NaverMapInstance
    icon?: {
      content: string
      anchor?: object
    }
    clickable?: boolean
  }) => NaverMarker
  Point: new (x: number, y: number) => object
  Event: {
    addListener(
      target: object,
      eventName: string,
      listener: () => void
    ): unknown
    removeListener(listener: unknown): void
  }
}

export function getNaverMaps(): NaverMapsApi | undefined {
  return (window as Window & { naver?: { maps: NaverMapsApi } }).naver?.maps
}
