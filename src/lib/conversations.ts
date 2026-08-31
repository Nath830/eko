/* Calculs dérivés des conversations : tri, aperçus, compteurs. */

import type { PlatformId } from '../config/platforms'
import { portraitForName } from '../data/portraits'
import type { Contact, Conversation, Message } from '../types'

export function lastMessage(conversation: Conversation): Message | undefined {
  return conversation.messages[conversation.messages.length - 1]
}

/** Date du dernier message — sert au tri de la boîte de réception */
export function lastActivity(conversation: Conversation): number {
  const message = lastMessage(conversation)
  return message ? new Date(message.sentAt).getTime() : 0
}

/** De la plus récente à la plus ancienne */
export function sortByRecency(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => lastActivity(b) - lastActivity(a))
}

/** Durée d'un vocal au format « 1:40 » */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

/** Texte brut d'un message, quel que soit son type */
export function messageDigest(message: Message): string {
  if (message.voice) return `Message vocal · ${formatDuration(message.voice.durationSec)}`
  if (message.text) return message.text.replace(/\s+/g, ' ').trim()
  if (message.attachments?.length) return message.attachments[0].fileName
  return ''
}

/** Aperçu affiché dans la liste : « Vous : d'accord » ou « Camille : c'est en ligne » */
export function previewText(conversation: Conversation): string {
  const message = lastMessage(conversation)
  if (!message) return 'Aucun message'

  const body = messageDigest(message)

  if (message.from === 'me') return `Vous : ${body}`
  if (conversation.isGroup && message.authorName) return `${message.authorName} : ${body}`
  return body
}

export function totalUnread(conversations: Conversation[]): number {
  return conversations.reduce((total, conversation) => total + conversation.unreadCount, 0)
}

/** Nombre de non-lus par plateforme, pour les pastilles des filtres */
export function unreadByPlatform(conversations: Conversation[]): Partial<Record<PlatformId, number>> {
  const counters: Partial<Record<PlatformId, number>> = {}

  for (const conversation of conversations) {
    counters[conversation.platform] = (counters[conversation.platform] ?? 0) + conversation.unreadCount
  }

  return counters
}

/** Toutes les conversations où cette personne intervient, tous canaux confondus */
export function conversationsOfContact(conversations: Conversation[], contactId: string): Conversation[] {
  return conversations.filter(
    (conversation) => conversation.contactId === contactId || conversation.participantIds?.includes(contactId),
  )
}

/** Quelle(s) photo(s) afficher pour une conversation : celle du contact,
    ou deux portraits superposés pour un groupe. */
export function conversationPhotos(
  conversation: Conversation,
  contacts: Contact[],
): { photo?: number; photos?: number[]; memberCount?: number } {
  if (conversation.contactId) {
    const contact = contacts.find((item) => item.id === conversation.contactId)
    if (contact) return { photo: contact.photo }
  }

  if (conversation.isGroup) {
    const participants = (conversation.participantIds ?? [])
      .map((id) => contacts.find((contact) => contact.id === id))
      .filter((contact): contact is Contact => contact !== undefined)

    const photos = participants.map((contact) => contact.photo)
    while (photos.length < 2) photos.push(portraitForName(conversation.title + photos.length))

    return { photos: photos.slice(0, 2), memberCount: conversation.memberCount }
  }

  return { photo: portraitForName(conversation.title) }
}
