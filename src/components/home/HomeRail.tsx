import { ArrowRight, CalendarDays, Inbox, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_ENTRIES } from '../../config/navigation'
import { USER } from '../../config/user'
import { PLATFORM_IDS, getPlatform, type PlatformId } from '../../config/platforms'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { Avatar } from '../ui/Avatar'
import { PlatformLogo } from '../ui/PlatformLogo'

interface HomeRailProps {
  /** La plateforme dont le panneau est ouvert */
  activePlatform?: PlatformId
  /** L'aperçu de la réception est-il ouvert ? */
  inboxOpen?: boolean
  /** Le panneau des priorités est-il ouvert ? */
  priorityOpen?: boolean
  onOpenInbox: () => void
  onOpenPriority: () => void
  onPickPlatform: (platform: PlatformId) => void
}

/* La petite barre de la page d'accueil.

   Survoler la boîte de réception déroule les six plateformes en dessous ;
   survoler la flèche du bas déroule les autres espaces de l'application. */
export function HomeRail({
  activePlatform,
  inboxOpen,
  priorityOpen,
  onOpenInbox,
  onOpenPriority,
  onPickPlatform,
}: HomeRailProps) {
  const { unreadTotal, unreadPerPlatform, priorityConversations } = useEko()
  const [platformsOpen, setPlatformsOpen] = useState(false)
  const [spacesOpen, setSpacesOpen] = useState(false)

  // Les espaces autres que la réception et le calendrier, déjà présents ici.
  const otherSpaces = NAV_ENTRIES.filter(
    (entry) => !['reception', 'calendrier', 'priorites', 'reglages'].includes(entry.id),
  )

  return (
    <nav
      aria-label="Navigation rapide"
      className="card fixed top-1/2 left-4 z-30 flex -translate-y-1/2 flex-col items-center gap-1.5 rounded-3xl px-2.5 py-3 md:left-6"
    >
      {/* Réception et, au survol, les plateformes */}
      <div
        onMouseEnter={() => setPlatformsOpen(true)}
        onMouseLeave={() => setPlatformsOpen(false)}
        className="flex flex-col items-center gap-1.5"
      >
        <button
          type="button"
          onClick={onOpenInbox}
          aria-pressed={inboxOpen}
          title="Voir les messages reçus"
          className={cx(
            'relative flex h-11 w-11 items-center justify-center rounded-2xl transition',
            inboxOpen ? 'bg-ink-900 text-white ring-2 ring-eko-500/45' : 'bg-ink-900 text-white hover:opacity-90',
          )}
        >
          <Inbox className="h-[20px] w-[20px]" aria-hidden />
          <span className="sr-only">Réception</span>

          {unreadTotal > 0 && (
            <span className="absolute -top-0.5 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-eko-accent px-1 text-[10px] font-semibold text-white ring-2 ring-card tabular-nums">
              {unreadTotal}
            </span>
          )}
        </button>

        <div
          className={cx(
            'flex flex-col items-center gap-1 overflow-hidden rounded-2xl transition-all duration-200',
            'max-md:max-h-[420px] max-md:opacity-100',
            platformsOpen || activePlatform || inboxOpen
              ? 'max-h-[420px] bg-ground p-1.5 opacity-100'
              : 'max-h-0 opacity-0',
          )}
        >
          {PLATFORM_IDS.map((id) => {
            const unread = unreadPerPlatform[id] ?? 0

            return (
              <button
                key={id}
                type="button"
                onClick={() => onPickPlatform(id)}
                title={getPlatform(id).name}
                className={cx(
                  'relative flex h-9 w-9 items-center justify-center rounded-xl transition',
                  activePlatform === id ? 'bg-card shadow-sm ring-2 ring-eko-500/45' : 'hover:bg-card',
                )}
              >
                <PlatformLogo platform={id} size={21} />
                {unread > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-[6px] w-[6px] rounded-full bg-eko-accent ring-2 ring-ground" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Les conversations mises en priorité */}
      <button
        type="button"
        onClick={onOpenPriority}
        aria-pressed={priorityOpen}
        title="Priorités"
        className={cx(
          'relative flex h-11 w-11 items-center justify-center rounded-2xl transition',
          priorityOpen ? 'bg-warn/15 text-warn' : 'text-ink-500 hover:bg-hover hover:text-warn',
        )}
      >
        <Star className={cx('h-[20px] w-[20px]', priorityOpen && 'fill-current')} aria-hidden />
        <span className="sr-only">Priorités</span>

        {priorityConversations.length > 0 && (
          <span className="absolute -top-0.5 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-warn px-1 text-[10px] font-semibold text-white ring-2 ring-card tabular-nums">
            {priorityConversations.length}
          </span>
        )}
      </button>

      <div className="my-1 h-px w-8 bg-line" />

      <Link
        to="/calendrier"
        title="Calendrier"
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-ink-500 transition hover:bg-hover hover:text-ink-900"
      >
        <CalendarDays className="h-[20px] w-[20px]" aria-hidden />
        <span className="sr-only">Calendrier</span>
      </Link>

      {/* La flèche mène au reste de l'application */}
      <div
        onMouseEnter={() => setSpacesOpen(true)}
        onMouseLeave={() => setSpacesOpen(false)}
        className="flex flex-col items-center gap-1.5"
      >
        <div
          className={cx(
            'flex flex-col items-center gap-1.5 overflow-hidden transition-all duration-200',
            'max-md:max-h-[420px] max-md:opacity-100',
            spacesOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          {otherSpaces.map((entry) => {
            const Icon = entry.icon

            return (
              <Link
                key={entry.id}
                to={entry.path}
                title={entry.label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-ink-500 transition hover:bg-hover hover:text-ink-900"
              >
                <Icon className="h-[19px] w-[19px]" aria-hidden />
                <span className="sr-only">{entry.label}</span>
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setSpacesOpen((value) => !value)}
          title="Le reste de l'application"
          aria-expanded={spacesOpen}
          className={cx(
            'flex h-11 w-11 items-center justify-center rounded-2xl transition',
            spacesOpen ? 'bg-hover text-ink-900' : 'text-ink-500 hover:bg-hover hover:text-ink-900',
          )}
        >
          <ArrowRight
            className={cx('h-[19px] w-[19px] transition-transform', spacesOpen && '-rotate-90')}
            aria-hidden
          />
          <span className="sr-only">Contacts et notes</span>
        </button>
      </div>

      <div className="my-1 h-px w-8 bg-line" />

      {/* Votre photo mène aux réglages */}
      <Link to="/reglages" title="Votre profil et les réglages" className="rounded-full transition hover:opacity-80">
        <Avatar title={USER.firstName} src={USER.photoUrl} size={34} />
        <span className="sr-only">Réglages</span>
      </Link>
    </nav>
  )
}
