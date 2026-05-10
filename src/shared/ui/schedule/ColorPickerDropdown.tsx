import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'

interface ColorPickerDropdownProps {
  selectedColor: ScheduleColor
  onColorChange: (color: ScheduleColor) => void
  isOpen: boolean
  onToggle: () => void
}

export function ColorPickerDropdown({
  selectedColor,
  onColorChange,
  isOpen,
  onToggle,
}: ColorPickerDropdownProps) {
  const colors = Object.values(ScheduleColor)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-12 w-full items-center gap-1 rounded-2xl bg-white px-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="typography-headline03 text-text-100">색상 선택</span>
          <div
            className="size-5 rounded-full"
            style={{ backgroundColor: selectedColor }}
            aria-hidden="true"
          />
        </div>
        <div className="flex h-6 w-6 items-center justify-center">
          <img
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-2xl bg-white p-4">
          <div className="grid grid-cols-4 gap-3">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onColorChange(color)
                }}
                className="relative flex items-center justify-center"
              >
                <div
                  className={`size-[38px] rounded-full transition-all ${
                    selectedColor === color ? '' : 'hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: color,
                    ...(selectedColor === color && {
                      boxShadow: `0 0 0 2px white, 0 0 0 4px ${color}`,
                    }),
                  }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
