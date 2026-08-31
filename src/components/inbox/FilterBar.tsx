import { ChevronDown, ListFilter, X } from 'lucide-react'
import { useState } from 'react'
import { getPlatform } from '../../config/platforms'
import { activeFilterCount } from '../../lib/filters'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'

/* Les filtres de la réception.

   Au repos, un seul bouton. On le déplie pour choisir « Non lus » ou
   « En attente ». Le filtre par plateforme, lui, se pose depuis le rail. */
export function FilterBar() {
  const { filters, setFilter, clearFilters } = useEko()
  const [open, setOpen] = useState(false)

  const count = activeFilterCount(filters)

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cx(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition',
          open || count > 0
            ? 'border-eko-500/40 bg-eko-50 text-eko-700'
            : 'border-line bg-card text-ink-500 hover:text-ink-900',
        )}
      >
        <ListFilter className="h-3 w-3" aria-hidden />
        Filtres
        {count > 0 && <span className="tabular-nums">· {count}</span>}
        <ChevronDown className={cx('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div className="flex items-center gap-1.5">
          <Toggle
            label="Non lus"
            active={filters.onlyUnread}
            onClick={() => setFilter('onlyUnread', !filters.onlyUnread)}
          />
          <Toggle
            label="En attente"
            active={filters.onlyAwaiting}
            onClick={() => setFilter('onlyAwaiting', !filters.onlyAwaiting)}
          />
        </div>
      )}

      {/* Rappel des filtres actifs */}
      {count > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px] text-ink-400">Filtres actifs :</span>

          {filters.platform !== 'all' && (
            <ActiveChip label={getPlatform(filters.platform).name} onRemove={() => setFilter('platform', 'all')} />
          )}
          {filters.onlyUnread && <ActiveChip label="Non lus" onRemove={() => setFilter('onlyUnread', false)} />}
          {filters.onlyAwaiting && <ActiveChip label="En attente" onRemove={() => setFilter('onlyAwaiting', false)} />}

          <button
            type="button"
            onClick={clearFilters}
            className="ml-0.5 text-[12px] font-medium text-eko-600 transition hover:text-eko-700"
          >
            Tout effacer
          </button>
        </div>
      )}
    </div>
  )
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'shrink-0 rounded-full border px-2.5 py-1 text-[12px] font-medium transition',
        active ? 'border-eko-500/40 bg-eko-50 text-eko-700' : 'border-line bg-card text-ink-500 hover:text-ink-900',
      )}
    >
      {label}
    </button>
  )
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ground px-2 py-0.5 text-[11.5px] text-ink-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Retirer le filtre ${label}`}
        className="text-ink-400 hover:text-ink-900"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  )
}
