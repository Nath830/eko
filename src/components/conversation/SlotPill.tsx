import { AlertTriangle, Check } from 'lucide-react'
import { cx } from '../../lib/cx'

interface SlotPillProps {
  label: string
  /** Le créneau est-il libre dans votre agenda ? */
  free: boolean
  onClick?: () => void
  className?: string
}

/** Petite pastille de créneau : l'heure, et libre ou occupé. */
export function SlotPill({ label, free, onClick, className }: SlotPillProps) {
  const Tag = onClick ? 'button' : 'span'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[12px] font-medium transition',
        free ? 'border-line text-ink-900' : 'border-warn/40 text-ink-700',
        onClick && 'hover:border-eko-500/50 hover:bg-eko-50',
        className,
      )}
    >
      {free ? (
        <Check className="h-3 w-3 shrink-0 text-ok" aria-hidden />
      ) : (
        <AlertTriangle className="h-3 w-3 shrink-0 text-warn" aria-hidden />
      )}

      {label}
      <span className={cx('font-semibold', free ? 'text-ok' : 'text-warn')}>{free ? 'Libre' : 'Occupé'}</span>
    </Tag>
  )
}
