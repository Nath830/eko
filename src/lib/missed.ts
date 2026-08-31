import { missedNotes } from '../data/briefs'
import type { Conversation } from '../types'
import { lastActivity, lastMessage } from './conversations'

/* ============================================================================
   CE QUI VOUS A ÉCHAPPÉ

   Les conversations non lues et celles qui attendent une réponse de votre
   part, classées par importance. La liste se calcule à partir de l'état réel :
   si vous avez tout lu, Eko le dit.

   Le classement combine trois choses : l'attente d'une réponse pèse le plus
   lourd, puis le poids écrit à la main dans briefs.ts, puis la fraîcheur.
============================================================================ */

export interface MissedItem {
  conversation: Conversation
  reason: string
  isUnread: boolean
  isAwaiting: boolean
  score: number
}

export interface MissedReport {
  unreadCount: number
  awaitingCount: number
  important: MissedItem[]
  others: MissedItem[]
}

export function buildMissed(conversations: Conversation[], isPriority: (id: string) => boolean): MissedReport {
  const items: MissedItem[] = []

  for (const conversation of conversations) {
    const isUnread = conversation.unreadCount > 0
    const isAwaiting = Boolean(conversation.awaitingReplySince)
    if (!isUnread && !isAwaiting) continue

    const note = missedNotes[conversation.id]
    const hoursOld = (Date.now() - lastActivity(conversation)) / 3_600_000

    const score =
      (isAwaiting ? 6 : 0) +
      (isPriority(conversation.id) ? 4 : 0) +
      (isUnread ? 2 : 0) +
      (note?.weight ?? 0) +
      // Ce qui traîne depuis longtemps compte davantage, sans écraser le reste.
      Math.min(4, hoursOld / 24)

    items.push({
      conversation,
      reason: note?.reason ?? conversation.ekoDigest,
      isUnread,
      isAwaiting,
      score,
    })
  }

  items.sort((a, b) => b.score - a.score)

  return {
    unreadCount: items.filter((item) => item.isUnread).length,
    awaitingCount: items.filter((item) => item.isAwaiting).length,
    important: items.slice(0, 3),
    others: items.slice(3),
  }
}

/** Le message qui a déclenché l'attente, pour ouvrir au bon endroit. */
export function missedAnchor(conversation: Conversation): string | undefined {
  return lastMessage(conversation)?.id
}
