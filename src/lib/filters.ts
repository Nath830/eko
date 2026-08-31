import type { PlatformId } from '../config/platforms'
import type { AlertHit, Conversation } from '../types'
import { lastActivity } from './conversations'
import { conversationMatches } from './search'

/* ============================================================================
   FILTRES CUMULABLES

   Plateforme, étiquette, non lus, en attente de réponse, alertes, période.
   Tous se combinent : chaque filtre actif réduit la liste.
============================================================================ */

export type PeriodFilter = 'all' | 'today' | 'week' | 'month'

export interface Filters {
  platform: PlatformId | 'all'
  labelIds: string[]
  onlyUnread: boolean
  onlyAwaiting: boolean
  onlyAlerts: boolean
  period: PeriodFilter
  query: string
}

export const EMPTY_FILTERS: Filters = {
  platform: 'all',
  labelIds: [],
  onlyUnread: false,
  onlyAwaiting: false,
  onlyAlerts: false,
  period: 'all',
  query: '',
}

const PERIOD_DAYS: Record<PeriodFilter, number | null> = {
  all: null,
  today: 1,
  week: 7,
  month: 30,
}

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: 'Toute période',
  today: "Aujourd'hui",
  week: '7 derniers jours',
  month: '30 derniers jours',
}

/** Nombre de filtres actuellement actifs, hors recherche textuelle */
export function activeFilterCount(filters: Filters): number {
  return (
    (filters.platform === 'all' ? 0 : 1) +
    filters.labelIds.length +
    (filters.onlyUnread ? 1 : 0) +
    (filters.onlyAwaiting ? 1 : 0) +
    (filters.onlyAlerts ? 1 : 0) +
    (filters.period === 'all' ? 0 : 1)
  )
}

export function applyFilters(
  conversations: Conversation[],
  filters: Filters,
  alertHits: AlertHit[],
): Conversation[] {
  const alerted = new Set(alertHits.map((hit) => hit.conversationId))
  const days = PERIOD_DAYS[filters.period]
  const floor = days === null ? null : Date.now() - days * 86_400_000

  return conversations.filter((conversation) => {
    if (filters.platform !== 'all' && conversation.platform !== filters.platform) return false
    if (filters.labelIds.length > 0 && !filters.labelIds.every((id) => conversation.labelIds.includes(id))) return false
    if (filters.onlyUnread && conversation.unreadCount === 0) return false
    if (filters.onlyAwaiting && !conversation.awaitingReplySince) return false
    if (filters.onlyAlerts && !alerted.has(conversation.id)) return false
    if (floor !== null && lastActivity(conversation) < floor) return false
    if (!conversationMatches(conversation, filters.query)) return false
    return true
  })
}
