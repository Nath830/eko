import { cx } from '../../lib/cx'

/* ============================================================================
   LOGO EKO

   Le « E » en trois barres pleines, puis « ko » en tracé géométrique fin.
   Tout est dessiné : le logo garde exactement les mêmes proportions quelle que
   soit la taille et sans dépendre d'une police installée.
============================================================================ */

interface EkoMarkProps {
  size?: number
  className?: string
}

/** La marque réduite : les trois barres seules. */
export function EkoMark({ size = 24, className }: EkoMarkProps) {
  return (
    <svg
      viewBox="0 0 68 100"
      height={size}
      width={size * 0.68}
      className={cx('shrink-0', className)}
      role="img"
      aria-label="Eko"
    >
      <rect x="0" y="0" width="68" height="17" fill="currentColor" />
      <rect x="0" y="41.5" width="68" height="17" fill="currentColor" />
      <rect x="0" y="83" width="68" height="17" fill="currentColor" />
    </svg>
  )
}

interface EkoWordmarkProps {
  /** Hauteur du logo en pixels */
  height?: number
  className?: string
}

/** Le logo complet. */
export function EkoWordmark({ height = 22, className }: EkoWordmarkProps) {
  return (
    <svg
      viewBox="0 0 200 100"
      height={height}
      width={height * 2}
      className={cx('shrink-0', className)}
      role="img"
      aria-label="Eko"
    >
      {/* Le E : trois barres pleines */}
      <rect x="0" y="0" width="68" height="17" fill="currentColor" />
      <rect x="0" y="41.5" width="68" height="17" fill="currentColor" />
      <rect x="0" y="83" width="68" height="17" fill="currentColor" />

      {/* Le k : hampe, bras et jambe, en trait fin */}
      <g stroke="currentColor" strokeWidth="8.5" fill="none" strokeLinecap="butt">
        <path d="M94 0v100" />
        <path d="M98 63 133 27" />
        <path d="M98 63 136 100" />
      </g>

      {/* Le o : un anneau parfait posé sur la ligne de base */}
      <circle cx="167" cy="72" r="27.5" stroke="currentColor" strokeWidth="8.5" fill="none" />
    </svg>
  )
}
