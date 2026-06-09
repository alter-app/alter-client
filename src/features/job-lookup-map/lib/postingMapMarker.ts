const MARKER_COLOR = 'rgba(7, 192, 121, 0.92)'

export function formatMarkerCount(count: number): string {
  if (count > 99) return '99+'
  return String(count)
}

export function getMarkerSize(count: number): number {
  if (count > 99) return 52
  if (count >= 10) return 48
  return 40
}

export function createMarkerHtml(count: number): string {
  const label = formatMarkerCount(count)
  const size = getMarkerSize(count)
  const fontSize = count > 99 ? 13 : count >= 10 ? 14 : 15

  return `<div style="
    display:flex;
    align-items:center;
    justify-content:center;
    width:${size}px;
    height:${size}px;
    border-radius:50%;
    background:${MARKER_COLOR};
    color:#fff;
    font-weight:600;
    font-size:${fontSize}px;
    line-height:1;
    font-family:'Pretendard Variable',Pretendard,sans-serif;
    box-shadow:0 2px 8px rgba(0,0,0,0.18);
    cursor:pointer;
    user-select:none;
  ">${label}</div>`
}
