import { createContext, useContext } from 'react'

export const DEFAULT_MOBILE_LAYOUT_MAX_WIDTH = '428px'

export const MobileLayoutMaxWidthContext = createContext(
  DEFAULT_MOBILE_LAYOUT_MAX_WIDTH
)

export function useMobileLayoutMaxWidth() {
  return useContext(MobileLayoutMaxWidthContext)
}
