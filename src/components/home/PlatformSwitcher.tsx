import { PLATFORM_IDS, getPlatform, type PlatformId } from '../../config/platforms'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { PlatformLogo } from '../ui/PlatformLogo'

interface PlatformSwitcherProps {
  /** La plateforme affichée, ou rien quand on regarde tout */
  current?: PlatformId
  onPick: (platform: PlatformId) => void
}

/** Rangée de logos en haut du panneau : passer d'une application à l'autre
    sans le refermer. */
export function PlatformSwitcher({ current, onPick }: PlatformSwitcherProps) {
  const { unreadPerPlatform } = useEko()

  return (
    <div className="flex items-center gap-1">
      {PLATFORM_IDS.map((id) => {
        const unread = unreadPerPlatform[id] ?? 0
        const isCurrent = current === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            aria-pressed={isCurrent}
            title={getPlatform(id).name}
            className={cx(
              'relative flex h-9 w-9 items-center justify-center rounded-xl transition',
              isCurrent ? 'bg-eko-50 ring-2 ring-eko-500/45' : 'hover:bg-hover',
            )}
          >
            <PlatformLogo platform={id} size={20} className={cx(!isCurrent && current && 'opacity-70')} />

            {unread > 0 && !isCurrent && (
              <span className="absolute top-0.5 right-0.5 h-[6px] w-[6px] rounded-full bg-eko-accent ring-2 ring-card" />
            )}
          </button>
        )
      })}
    </div>
  )
}
