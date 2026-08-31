import type { AlertHit, CalendarEvent, Conversation, Note, TimelineEntry } from '../types'
import { messageDigest } from './conversations'

/* ============================================================================
   HISTORIQUE

   Une timeline verticale de tout ce qui s'est passé avec une personne, toutes
   plateformes confondues : messages, pièces jointes, rendez-vous, notes et
   alertes déclenchées.
============================================================================ */

interface TimelineSources {
  conversations: Conversation[]
  notes: Note[]
  events: CalendarEvent[]
  alertHits: AlertHit[]
}

export function buildContactTimeline(contactId: string, sources: TimelineSources): TimelineEntry[] {
  const entries: TimelineEntry[] = []

  const related = sources.conversations.filter(
    (conversation) => conversation.contactId === contactId || conversation.participantIds?.includes(contactId),
  )

  for (const conversation of related) {
    for (const message of conversation.messages) {
      if (message.attachments?.length) {
        for (const attachment of message.attachments) {
          entries.push({
            id: `tl-file-${attachment.id}-${message.id}`,
            kind: 'attachment',
            platform: conversation.platform,
            date: message.sentAt,
            title: attachment.fileName,
            detail: `${attachment.sizeLabel} · ${message.from === 'me' ? 'envoyé' : 'reçu'}`,
            conversationId: conversation.id,
          })
        }
      }
    }

    const last = conversation.messages[conversation.messages.length - 1]
    if (last) {
      entries.push({
        id: `tl-msg-${conversation.id}`,
        kind: 'message',
        platform: conversation.platform,
        date: last.sentAt,
        title: `Dernier échange · ${conversation.title}`,
        detail: messageDigest(last),
        conversationId: conversation.id,
      })
    }
  }

  for (const note of sources.notes.filter((item) => item.contactId === contactId)) {
    entries.push({
      id: `tl-note-${note.id}`,
      kind: 'note',
      date: note.createdAt,
      title: note.title ?? 'Note',
      detail: note.author === 'eko' ? 'Consignée par Eko' : 'Votre note',
      conversationId: note.conversationId,
    })
  }

  for (const event of sources.events.filter((item) => item.contactId === contactId)) {
    entries.push({
      id: `tl-evt-${event.id}`,
      kind: 'event',
      date: event.start,
      title: event.title,
      detail: event.location,
    })
  }

  const relatedIds = new Set(related.map((conversation) => conversation.id))
  for (const hit of sources.alertHits.filter((item) => relatedIds.has(item.conversationId))) {
    entries.push({
      id: `tl-alert-${hit.id}`,
      kind: 'alert',
      date: hit.triggeredAt,
      title: 'Alerte déclenchée',
      detail: 'Un message a correspondu à une de vos alertes',
      conversationId: hit.conversationId,
    })
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
