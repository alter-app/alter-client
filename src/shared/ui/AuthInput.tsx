import type { InputHTMLAttributes } from 'react'
import { colors, fontFamilies, fontSizes, fontWeights } from '../lib/tokens'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  borderColor?: string
}

export function AuthInput({
  borderColor,
  className = '',
  ...props
}: AuthInputProps) {
  return (
    <input
      className={className}
      style={{
        width: '100%',
        height: '56px',
        padding: '0 16px',
        border: borderColor || `1px solid ${colors.line[2]}`,
        borderRadius: '12px',
        fontFamily: fontFamilies.pretendard,
        fontSize: fontSizes[4],
        fontWeight: fontWeights.regular,
        color: colors.text[100],
        backgroundColor: '#ffffff',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        boxSizing: 'border-box',
      }}
      {...props}
    />
  )
}
