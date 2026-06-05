interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  ariaLabel?: string
}

export function Toggle({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-main' : 'bg-line-1'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <span
        className={`absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-white shadow transition-[left] ${
          checked ? 'left-[26px]' : 'left-[2px]'
        }`}
      />
    </button>
  )
}
