import type { Conversation, Message } from '../types'
import { flatten, hasClockTime, hasDayHint, hasTimeHint, readSlot } from './frenchDates'

/* ============================================================================
   LES RENDEZ-VOUS REPÉRÉS DANS LES MESSAGES

   Eko lit chaque message et reconnaît une proposition de rendez-vous : un mot
   qui évoque une rencontre, plus un jour ou une heure. Une carte apparaît
   alors dans le fil, reliée à l'agenda.

   Le repérage est volontairement exigeant : sans indice de rencontre, « je te
   réponds demain » n'est pas un rendez-vous.
============================================================================ */

/** Mots qui annoncent clairement une rencontre. */
const STRONG_CUES: { word: string; label: string }[] = [
  { word: 'rendez vous', label: 'Rendez-vous' },
  { word: 'rdv', label: 'Rendez-vous' },
  { word: 'reunion', label: 'Réunion' },
  { word: 'appel', label: 'Appel' },
  { word: 'call', label: 'Appel' },
  { word: 'dejeuner', label: 'Déjeuner' },
  { word: 'entretien', label: 'Entretien' },
  { word: 'visio', label: 'Visio' },
  { word: 'se voir', label: 'Rencontre' },
  { word: 'passer te voir', label: 'Rencontre' },
  { word: 'se cale', label: 'Point' },
  { word: 'on cale', label: 'Point' },
  { word: 'dispo', label: 'Point' },
  { word: 'disponible', label: 'Point' },
]

/** Mots trop courants pour suffire seuls : « chaque point » n'est pas un
    rendez-vous. Ils ne comptent qu'accompagnés d'une heure précise. */
const WEAK_CUES: { word: string; label: string }[] = [{ word: 'point', label: 'Point' }]

export interface DetectedEvent {
  /** L'identifiant du message d'origine sert d'identifiant à la proposition */
  id: string
  /* Ce qui identifie le créneau lui-même, indépendamment du message.
     C'est cette signature qui retient votre décision : une proposition
     acceptée pendant que vous écriviez ne se represente pas une fois le
     message envoyé. */
  signature: string
  conversationId: string
  contactId?: string
  title: string
  start: string
  end: string
  sourceQuote: string
}

/** Le créneau contenu dans un texte libre, s'il y en a un.
    Sert aussi bien à relire les messages reçus qu'à surveiller ce que vous
    êtes en train d'écrire. */
export function detectEventInText(input: string): { label: string; start: Date; end: Date } | null {
  const text = flatten(input)
  const strong = STRONG_CUES.find((entry) => text.includes(entry.word))
  const weak = WEAK_CUES.find((entry) => text.includes(entry.word))
  const cue = strong ?? weak

  const clock = hasClockTime(text)

  // Trois façons de reconnaître une proposition :
  // — un mot de rencontre franc, accompagné d'un jour ou d'une heure ;
  // — un mot courant comme « point », mais alors une heure précise s'impose ;
  // — un jour ET une heure précise, ce qui suffit seul (« lundi 10h »).
  const named = strong !== undefined && (hasTimeHint(text) || hasDayHint(text))
  const weakNamed = weak !== undefined && clock
  const preciseSlot = hasDayHint(text) && clock
  if (!named && !weakNamed && !preciseSlot) return null

  const { start, end } = readSlot(text)

  // Une proposition passée n'a plus d'intérêt.
  if (start.getTime() < Date.now() - 3_600_000) return null

  return { label: cue?.label ?? 'Rendez-vous', start, end }
}

/** La signature d'un créneau : la conversation, le type et l'horaire. */
export function slotSignature(conversationId: string, label: string, start: Date): string {
  return `${conversationId}|${label}|${start.toISOString()}`
}

/** Le rendez-vous contenu dans ce message, s'il y en a un. */
export function detectEventInMessage(message: Message, conversation: Conversation): DetectedEvent | null {
  // Les rendez-vous déjà écrits dans les données ont leur propre carte.
  if (message.eventProposalId || !message.text) return null

  const slot = detectEventInText(message.text)
  if (!slot) return null

  const withWhom = message.from === 'me' ? conversation.title : (message.authorName ?? conversation.title)

  return {
    id: message.id,
    signature: slotSignature(conversation.id, slot.label, slot.start),
    conversationId: conversation.id,
    contactId: conversation.contactId,
    title: `${slot.label} avec ${withWhom}`,
    start: slot.start.toISOString(),
    end: slot.end.toISOString(),
    sourceQuote: message.text.replace(/\s+/g, ' ').trim(),
  }
}

/** Tous les rendez-vous repérés dans une liste de conversations. */
export function detectEventsInConversations(conversations: Conversation[]): DetectedEvent[] {
  const found: DetectedEvent[] = []

  for (const conversation of conversations) {
    for (const message of conversation.messages) {
      const event = detectEventInMessage(message, conversation)
      if (event) found.push(event)
    }
  }

  return found.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}
