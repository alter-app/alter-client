import { Toggle } from '@/shared/ui/common/Toggle'

interface Props {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  description?: string
  labelVariant?: 'semibold' | 'regular'
}

export function NotificationToggleRow({
  label,
  checked,
  onChange,
  disabled,
  description,
  labelVariant = 'regular',
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span
          className={`${labelVariant === 'semibold' ? 'typography-body01-semibold' : 'typography-body01-regular'} text-text-100`}
        >
          {label}
        </span>
        {description && (
          <span className="typography-body02-regular text-text-70">
            {description}
          </span>
        )}
      </div>
      <Toggle
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ariaLabel={label}
      />
    </div>
  )
}
