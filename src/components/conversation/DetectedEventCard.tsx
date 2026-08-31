import { CalendarPlus, Check, X } from 'lucide-react'
import type { DetectedEvent } from '../../lib/eventDetection'
import { findConflict, spokenDay, spokenTime } from '../../lib/scheduling'
import { useEko } from '../../store/EkoStore'
import { useEventComposer } from '../../store/EventComposerContext'
import { SlotPill } from './SlotPill'

/* Rendez-vous repéré par Eko dans le message juste au-dessus.

   Volontairement discret : une pastille qui dit l'heure et si vous êtes
   libre, et un bouton pour l'ajouter. */
export function DetectedEventCard({ event }: { event: DetectedEvent }) {
  const { detectionStatus, declineDetectedEvent, events, getContact, getConversation } = useEko()
  const { openEventComposer } = useEventComposer()

  const status = detectionStatus[event.signature]
  const start = new Date(event.start)
  const conflict = findConflict(events, start, new Date(event.end))

  if (status === 'declined') return null

  if (status === 'accepted') {
    return (
      <p className="mt-1.5 flex items-center gap-1.5 px-1 text-[11.5px] text-ink-500">
        <Check className="h-3 w-3 shrink-0 text-ok" aria-hidden />
        {spokenDay(start)} {spokenTime(start)} — ajouté à votre agenda
      </p>
    )
  }

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
      <SlotPill label={`${spokenDay(start)} ${spokenTime(start)}`} free={!conflict} />

      {conflict && <span className="text-[11.5px] text-ink-500">{conflict.title}</span>}

      <button
        type="button"
        onClick={() => {
          const conversation = getConversation(event.conversationId)
          const ids = conversation?.contactId ? [conversation.contactId] : (conversation?.participantIds ?? [])

          openEventComposer({
            title: event.title,
            start: event.start,
            end: event.end,
            contactId: event.contactId,
            conversationId: event.conversationId,
            signature: event.signature,
            guests: ids
              .map((id) => getContact(id))
              .filter((contact) => contact !== undefined)
              .map(
                (contact) =>
                  contact.handles.find((handle) => handle.platform === 'email')?.handle ?? contact.fullName,
              ),
          })
        }}
        className="flex items-center gap-1.5 rounded-full bg-eko-500 px-2.5 py-1 text-[12px] font-medium text-white transition hover:bg-eko-600"
      >
        <CalendarPlus className="h-3 w-3" aria-hidden />
        Ajouter
      </button>

      <button
        type="button"
        onClick={() => declineDetectedEvent(event)}
        aria-label="Ignorer la proposition"
        className="rounded-lg p-1 text-ink-400 transition hover:bg-hover hover:text-ink-900"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  )
}
