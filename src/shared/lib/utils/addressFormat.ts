export interface AddressParts {
  /** 기본 주소(도로명) */
  fullAddress?: string | null
  /** 지번 주소 — 기존 업장은 null */
  jibunAddress?: string | null
  /** 상세 주소 — 기존 업장은 null */
  detailAddress?: string | null
}

function clean(value: string | null | undefined): string {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  // 서버/직렬화 과정에서 문자열 "null"이 섞여도 노출하지 않는다
  return trimmed === 'null' || trimmed === 'undefined' ? '' : trimmed
}

/** 기본 + 상세 주소를 한 줄로. 비어 있는 칸은 건너뛴다. */
export function formatAddress(parts: AddressParts): string {
  return [clean(parts.fullAddress), clean(parts.detailAddress)]
    .filter(Boolean)
    .join(' ')
}

/** 지번 주소 — 값이 없으면 빈 문자열(호출부에서 줄 자체를 숨긴다) */
export function formatJibunAddress(parts: AddressParts): string {
  return clean(parts.jibunAddress)
}
