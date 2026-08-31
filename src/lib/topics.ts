import type { Conversation } from '../types'

/* ============================================================================
   LES SUJETS

   Un sujet regroupe les échanges qui portent sur la même affaire, quelles que
   soient les plateformes. Rien n'est rapproché sur la seule base de
   l'interlocuteur : si une même personne écrit sur deux affaires différentes,
   les deux restent séparées.
============================================================================ */

/** Toutes les conversations d'un sujet. */
export function conversationsOfTopic(conversations: Conversation[], topicId: string): Conversation[] {
  return conversations.filter((conversation) => conversation.topicId === topicId)
}
