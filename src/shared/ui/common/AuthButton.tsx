import type { ButtonHTMLAttributes } from 'react'
import { colors, fontFamilies, fontSizes, fontWeights } from '../../lib/tokens'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function AuthButton({
  className = '',
  children,
  ...props
}: AuthButtonProps) {
  return (
    <button
      className={className}
      style={{
        width: '100%',
        height: '56px',
        border: 'none',
        background: colors.main.DEFAULT,
        color: '#fff',
        fontSize: fontSizes[5],
        fontFamily: fontFamilies.pretendard,
        fontWeight: fontWeights.semibold,
        borderRadius: '12px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: props.disabled ? 'none' : '0 2px 8px rgba(7, 192, 121, 0.3)',
        opacity: props.disabled ? 0.6 : 1,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
