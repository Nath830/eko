import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NAV_ENTRIES, type NavEntry } from '../../config/navigation'
import { PLATFORM_IDS, getPlatform } from '../../config/platforms'
import { USER } from '../../config/user'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { Avatar } from '../ui/Avatar'
import { EkoMark } from '../ui/EkoMark'
import { PlatformLogo } from '../ui/PlatformLogo'

/* Rail flottant.

   Trois blocs bien séparés : la marque et la réception, les plateformes
   réunies sur un fond propre, puis les autres espaces. Tout en bas, votre
   photo mène aux réglages. */
export function NavRail() {
  const { unreadTotal, filters, setFilter, unreadPerPlatform } = useEko()
  const navigate = useNavigate()

  const inbox = NAV_ENTRIES.find((entry) => entry.id === 'reception')
  const spaces = NAV_ENTRIES.filter((entry) => entry.position === 'main' && entry.id !== 'reception')
  const settings = NAV_ENTRIES.find((entry) => entry.position === 'bottom')

  function filterBy(platform: (typeof PLATFORM_IDS)[number]) {
    setFilter('platform', filters.platform === platform ? 'all' : platform)
    navigate('/reception')
  }

  return (
    <nav
      aria-label="Navigation principale"
      className={cx(
        'card z-20 flex shrink-0',
        'h-[72px] items-center justify-around gap-1 rounded-3xl px-2',
        'md:h-full md:w-[76px] md:flex-col md:justify-start md:gap-2 md:px-2.5 md:py-3.5',
      )}
    >
      <Link to="/" title="Accueil" className="hidden pb-1 text-ink-900 transition hover:opacity-70 md:block">
        <EkoMark size={22} />
      </Link>

      {inbox && <SpaceLink entry={inbox} badge={unreadTotal} />}

      {/* Les plateformes, réunies sur leur propre fond */}
      <div className="hidden flex-col items-center gap-1 rounded-2xl bg-ground p-1.5 md:flex">
        {PLATFORM_IDS.map((id) => {
          const isActive = filters.platform === id
          const unread = unreadPerPlatform[id] ?? 0

          return (
            <button
              key={id}
              type="button"
              onClick={() => filterBy(id)}
              aria-pressed={isActive}
              title={`${getPlatform(id).name}${isActive ? ' — filtre actif' : ''}`}
              className={cx(
                'relative flex h-9 w-9 items-center justify-center rounded-xl transition',
                isActive ? 'bg-card shadow-sm ring-2 ring-eko-500/45' : 'hover:bg-card',
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

      <div className="mx-1 hidden h-px w-9 bg-line md:my-1.5 md:block" />

      <div className="flex items-center gap-1 md:flex-col md:gap-1.5">
        {spaces.map((entry) => (
          <SpaceLink key={entry.id} entry={entry} badge={0} />
        ))}
      </div>

      <div className="hidden flex-1 md:block" />

      {/* Votre photo, en bas, à la place de l'icône des réglages */}
      {settings && (
        <NavLink
          to={settings.path}
          title="Votre profil et les réglages"
          className={({ isActive }) =>
            cx(
              'rounded-full transition',
              isActive ? 'ring-2 ring-ink-900 ring-offset-2 ring-offset-card' : 'hover:opacity-80',
            )
          }
        >
          <Avatar title={USER.firstName} src={USER.photoUrl} size={34} />
          <span className="sr-only">{settings.label}</span>
        </NavLink>
      )}
    </nav>
  )
}

function SpaceLink({ entry, badge }: { entry: NavEntry; badge: number }) {
  const Icon = entry.icon

  return (
    <NavLink
      to={entry.path}
      title={entry.label}
      className={({ isActive }) =>
        cx(
          'relative flex h-10 w-10 items-center justify-center rounded-2xl transition',
          isActive ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-hover hover:text-ink-900',
        )
      }
    >
      <Icon className="h-[19px] w-[19px]" aria-hidden />
      <span className="sr-only">{entry.label}</span>

      {badge > 0 && (
        <span className="absolute -top-0.5 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-eko-accent px-1 text-[10px] font-semibold text-white ring-2 ring-card tabular-nums">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )
}
