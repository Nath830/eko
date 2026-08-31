import { Sparkles } from 'lucide-react'
import { cx } from '../../lib/cx'
import type { Label } from '../../types'

interface LabelChipProps {
  label: Label
  onClick?: () => void
  active?: boolean
  className?: string
}

/** Étiquette. Celles posées par Eko portent l'étincelle ; les vôtres, un point. */
export function LabelChip({ label, onClick, active, className }: LabelChipProps) {
  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-medium transition',
        onClick && 'hover:brightness-95',
        className,
      )}
      style={{
        color: label.color,
        borderColor: active ? label.color : `color-mix(in srgb, ${label.color} 32%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${label.color} ${active ? 18 : 9}%, white)`,
      }}
    >
      {label.kind === 'auto' ? (
        <Sparkles className="h-2.5 w-2.5" aria-hidden />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} aria-hidden />
      )}
      {label.name}
    </Tag>
  )
}
