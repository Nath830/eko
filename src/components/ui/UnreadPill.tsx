import { cx } from '../../lib/cx'

interface UnreadPillProps {
  count: number
  className?: string
}

/** Pastille indiquant un nombre de messages non lus. */
export function UnreadPill({ count, className }: UnreadPillProps) {
  if (count <= 0) return null

  return (
    <span
      className={cx(
        'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-eko-500 px-1.5',
        'text-[10.5px] font-semibold text-white tabular-nums',
        className,
      )}
      aria-label={`${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
