import { cx } from '../../lib/cx'

interface EkoOrbProps {
  open: boolean
  onClick: () => void
}

/* La bille d'Eko : un rond plein aux deux teintes de la marque, qui tournent
   lentement. Le contour noir la détache du fond clair, et sa taille ne bouge
   jamais — seul le halo indique que l'assistant est ouvert. */
export function EkoOrb({ open, onClick }: EkoOrbProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label="Parler à Eko"
      title="Parler à Eko"
      className={cx(
        'absolute top-3 right-3 z-30 h-12 w-12 overflow-hidden rounded-full border-[2.5px] border-ink-900 transition',
        'shadow-[0_6px_20px_-4px_rgb(20_22_28/0.4)]',
        open
          ? 'ring-4 ring-ink-900/15'
          : 'hover:shadow-[0_8px_26px_-4px_rgb(20_22_28/0.5)]',
      )}
    >
      <span className="eko-orb absolute -inset-4" aria-hidden />
    </button>
  )
}
