import { naturalQueries } from '../data/naturalQueries'
import type { Contact, Conversation, Message } from '../types'
import { findMatchingMessage, normalize, textMatches } from './search'

/* ============================================================================
   PARLER À EKO

   La barre du haut n'est pas un champ de recherche classique : on lui parle.
   « je cherche la discussion avec un client mais je ne me souviens plus de son
   nom » doit fonctionner aussi bien que « devis ».

   Trois voies, dans cet ordre :
   1. Une formulation reconnue → réponse et résultats pré-écrits.
   2. Une description de personne (rôle, entreprise, contexte) → le contact.
   3. Des mots-clés → recherche dans le contenu des messages.

   La comparaison se fait sur les mots significatifs, pas sur la phrase
   entière : l'ordre des mots et les tournures n'ont pas d'importance.
============================================================================ */

const STOP_WORDS = new Set(
  `a ai as au aux avec ce cet cette ces c d dans de des du elle en est et eux il ils je j l la le les leur lui ma
   mais me mes moi mon n ne nos notre nous on ou ou_ par pas plus pour qu que qui quoi sa se ses son sont sur ta te
   tes toi ton tu un une vos votre vous y etait etais the of chercher cherche recherche retrouve retrouver trouve
   trouver savoir sais souviens souvenir rappelle rappeler discussion conversation message messages nom appelle
   appeler comment quel quelle quels quelles est_ce estce`
    .split(/\s+/)
    .filter(Boolean),
)

function tokens(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

/** Part des mots de la référence que l'on retrouve dans la demande. */
function overlap(asked: string[], reference: string[]): number {
  if (reference.length === 0) return 0

  const found = reference.filter((word) =>
    asked.some((token) => token === word || token.startsWith(word) || word.startsWith(token)),
  ).length

  return found / reference.length
}

export interface SearchResult {
  conversation: Conversation
  message?: Message
}

export interface SearchOutcome {
  kind: 'natural' | 'contact' | 'keyword' | 'empty'
  /** Ce qu'Eko a compris, affiché en tête des résultats */
  interpretation?: string
  /** La réponse d'Eko, formulée comme un assistant */
  answer?: string
  results: SearchResult[]
}

export function runSearch(
  query: string,
  conversations: Conversation[],
  contacts: Contact[] = [],
): SearchOutcome {
  const trimmed = query.trim()
  if (!trimmed) return { kind: 'empty', results: [] }

  const asked = tokens(trimmed)

  /* ------- 1. Une formulation reconnue ------- */
  let best: { score: number; entry: (typeof naturalQueries)[number] } | null = null

  for (const entry of naturalQueries) {
    const score = Math.max(...entry.patterns.map((pattern) => overlap(asked, tokens(pattern))))
    if (score >= 0.5 && (!best || score > best.score)) best = { score, entry }
  }

  if (best) {
    const results: SearchResult[] = []
    for (const { conversationId, messageId } of best.entry.results) {
      const conversation = conversations.find((item) => item.id === conversationId)
      if (!conversation) continue
      results.push({
        conversation,
        message: messageId ? conversation.messages.find((message) => message.id === messageId) : undefined,
      })
    }

    if (results.length > 0) {
      return {
        kind: 'natural',
        interpretation: best.entry.interpretation,
        answer: best.entry.answer,
        results,
      }
    }
  }

  /* ------- 2. Une personne décrite, pas nommée ------- */
  let bestContact: { score: number; contact: Contact } | null = null

  for (const contact of contacts) {
    const description = tokens(
      [contact.fullName, contact.role, contact.company, contact.ekoSummary].filter(Boolean).join(' '),
    )
    const namedDirectly = textMatches(contact.fullName, trimmed) ? 1 : 0
    const score = Math.max(namedDirectly, overlap(description, asked))

    if (score >= 0.34 && (!bestContact || score > bestContact.score)) bestContact = { score, contact }
  }

  if (bestContact) {
    const { contact } = bestContact
    const theirs = conversations.filter(
      (conversation) => conversation.contactId === contact.id || conversation.participantIds?.includes(contact.id),
    )

    if (theirs.length > 0) {
      const platforms = new Set(theirs.map((conversation) => conversation.platform)).size

      return {
        kind: 'contact',
        interpretation: `${contact.fullName}${contact.role ? ` · ${contact.role}` : ''}`,
        answer: `Vous pensez probablement à ${contact.fullName}${
          contact.company ? `, ${contact.role?.toLowerCase()} chez ${contact.company}` : ''
        }. Vous avez ${theirs.length} conversation${theirs.length > 1 ? 's' : ''} avec ${
          contact.fullName.split(' ')[0]
        }, réparties sur ${platforms} plateforme${platforms > 1 ? 's' : ''}.`,
        results: theirs.map((conversation) => ({ conversation })),
      }
    }
  }

  /* ------- 3. Des mots-clés dans les messages ------- */
  const byKeyword = conversations
    .map((conversation) => ({ conversation, message: findMatchingMessage(conversation, trimmed) }))
    .filter((result) => result.message !== undefined || textMatches(result.conversation.ekoDigest, trimmed))

  if (byKeyword.length > 0) return { kind: 'keyword', results: byKeyword }

  return { kind: 'empty', results: [] }
}
