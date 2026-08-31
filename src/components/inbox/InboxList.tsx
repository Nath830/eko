import { SearchX } from 'lucide-react'
import { getPlatform } from '../../config/platforms'
import { useEko } from '../../store/EkoStore'
import { ConversationRow } from './ConversationRow'
import { FilterBar } from './FilterBar'

interface InboxListProps {
  activeId?: string
}

/** Colonne de gauche : toutes les conversations, tous canaux confondus. */
export function InboxList({ activeId }: InboxListProps) {
  const { visibleConversations, unreadTotal, filters, clearFilters } = useEko()

  const platformName = filters.platform === 'all' ? null : getPlatform(filters.platform).name

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 space-y-2.5 border-b border-line-soft px-4 pt-3.5 pb-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[16px] font-semibold tracking-tight">
            {platformName ? `Réception · ${platformName}` : 'Réception'}
          </h1>
          <span className="text-[12px] text-ink-400 tabular-nums">
            {visibleConversations.length} conversation{visibleConversations.length > 1 ? 's' : ''}
            {unreadTotal > 0 && ` · ${unreadTotal} non lus`}
          </span>
        </div>

        <FilterBar />
      </header>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
        {visibleConversations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <SearchX className="h-6 w-6 text-ink-200" aria-hidden />
            <p className="text-[14px] font-medium text-ink-700">Aucune conversation</p>
            <p className="text-[12.5px] text-ink-500">
              {filters.query
                ? `Rien ne correspond à « ${filters.query} ».`
                : 'Aucune conversation ne passe les filtres actifs.'}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 text-[12.5px] font-medium text-eko-600 hover:text-eko-700"
            >
              Tout effacer
            </button>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {visibleConversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationRow conversation={conversation} isActive={conversation.id === activeId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
