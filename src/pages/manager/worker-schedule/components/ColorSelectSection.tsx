import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import { ScheduleColor } from '@/features/manager'
import { cn } from '@/shared/lib/utils'

interface ColorSelectSectionProps {
  selectedColor: ScheduleColor
  onColorChange: (color: ScheduleColor) => void
  isOpen: boolean
  onToggle: () => void
}

const COLOR_GRID_PADDING = 'px-[30px] pt-[29px] pb-[29px]'

export function ColorSelectSection({
  selectedColor,
  onColorChange,
  isOpen,
  onToggle,
}: ColorSelectSectionProps) {
  const colors = Object.values(ScheduleColor)

  return (
    <section className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex h-12 w-full items-center rounded-2xl bg-white px-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="typography-headline03 text-text-100">색상 선택</span>
          <div
            className="size-5 rounded-full"
            style={{ backgroundColor: selectedColor }}
            aria-hidden="true"
          />
        </div>
        <img
          src={chevronDownIcon}
          alt=""
          aria-hidden="true"
          className={cn('size-6 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? (
        <div
          className={cn(
            'grid min-h-[161px] grid-cols-4 gap-x-[48px] gap-y-[27px] rounded-2xl bg-white',
            COLOR_GRID_PADDING
          )}
        >
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className="flex items-center justify-center"
              aria-label="스케줄 색상 선택"
              aria-pressed={selectedColor === color}
            >
              <span
                className="size-[38px] rounded-full"
                style={{
                  backgroundColor: color,
                  ...(selectedColor === color && {
                    boxShadow: `0 0 0 2px white, 0 0 0 4px ${color}`,
                  }),
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
