import { PORTRAIT_SHEET, portraitForName, portraitPosition } from '../../data/portraits'
import { cx } from '../../lib/cx'

interface AvatarProps {
  title: string
  size?: number
  /** Photo choisie explicitement (0 à 5). Sinon, choix stable d'après le nom. */
  photo?: number
  /** Deux personnes superposées, pour un groupe ou un canal */
  photos?: number[]
  /** Nombre de membres, affiché en pastille sur les groupes */
  memberCount?: number
  className?: string
}

/** Photo de profil, découpée dans la planche de portraits.
    Un groupe se reconnaît à ses deux portraits et à sa pastille de membres. */
export function Avatar({ title, size = 44, photo, photos, memberCount, className }: AvatarProps) {
  if (photos && photos.length > 1) {
    const [first, second] = photos

    return (
      <span
        className={cx('relative inline-block shrink-0', className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label={title}
      >
        <Portrait index={second} size={size * 0.64} className="absolute top-0 right-0 ring-2 ring-card" />
        <Portrait index={first} size={size * 0.7} className="absolute bottom-0 left-0 ring-2 ring-card" />

        {memberCount !== undefined && (
          <span
            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-ink-900 font-semibold text-white ring-2 ring-card tabular-nums"
            style={{ height: size * 0.42, minWidth: size * 0.42, fontSize: size * 0.24, paddingInline: size * 0.08 }}
          >
            {memberCount}
          </span>
        )}
      </span>
    )
  }

  return <Portrait index={photo ?? portraitForName(title)} size={size} label={title} className={className} />
}

interface PortraitProps {
  index: number
  size: number
  label?: string
  className?: string
}

function Portrait({ index, size, label, className }: PortraitProps) {
  return (
    <span
      className={cx('inline-block shrink-0 rounded-full bg-ground bg-no-repeat', className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${PORTRAIT_SHEET})`,
        ...portraitPosition(index),
      }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
