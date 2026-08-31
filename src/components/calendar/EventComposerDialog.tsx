import { AlignLeft, Clock, Eye, MapPin, MessageSquare, Users, Video, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlatform } from '../../config/platforms'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { useEventComposer } from '../../store/EventComposerContext'
import { useToast } from '../../store/ToastContext'

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

/* La fenêtre de création d'événement, au centre de l'écran.

   Elle reprend la disposition de l'agenda : titre, créneau, invités, lien de
   visioconférence, lieu, description, visibilité, et le message d'origine. */
export function EventComposerDialog() {
  const { draft, closeEventComposer } = useEventComposer()
  const { createEvent, acceptDetectedEvent, getConversation } = useEko()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [guests, setGuests] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [meet, setMeet] = useState(false)
  const [hideGuests, setHideGuests] = useState(false)

  useEffect(() => {
    if (!draft) return
    setTitle(draft.title)
    setGuests(draft.guests)
    setLocation('')
    setDescription('')
    setMeet(false)
    setHideGuests(false)
  }, [draft])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeEventComposer()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeEventComposer])

  if (!draft) return null

  const start = new Date(draft.start)
  const end = new Date(draft.end)
  const conversation = getConversation(draft.conversationId)

  function save() {
    if (!draft) return

    const event = {
      title: title.trim() || draft.title,
      start: draft.start,
      end: draft.end,
      contactId: draft.contactId,
      location: meet ? 'Visioconférence' : location.trim() || undefined,
    }

    if (draft.signature) {
      // Passe aussi par le store pour que la proposition ne se represente pas.
      acceptDetectedEvent({
        id: draft.signature,
        signature: draft.signature,
        conversationId: draft.conversationId ?? '',
        contactId: draft.contactId,
        title: event.title,
        start: draft.start,
        end: draft.end,
        sourceQuote: '',
      })
    } else {
      createEvent(event)
    }

    notify(`${event.title} ajouté à votre agenda`, {
      tone: 'success',
      to: '/calendrier',
      actionLabel: 'Voir le calendrier',
    })
    closeEventComposer()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={closeEventComposer}
        aria-label="Fermer"
        className="absolute inset-0 cursor-default bg-ink-900/25 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nouvel événement"
        className="card relative flex max-h-[86vh] w-[min(440px,100%)] flex-col overflow-hidden rounded-3xl"
      >
        <header className="flex shrink-0 items-start gap-3 px-6 pt-6 pb-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Titre de l'événement"
            className="min-w-0 flex-1 bg-transparent text-[19px] leading-snug font-semibold text-ink-900 focus:outline-none"
          />

          <button
            type="button"
            onClick={closeEventComposer}
            aria-label="Fermer"
            className="-mr-1.5 rounded-lg p-1.5 text-ink-400 transition hover:bg-hover hover:text-ink-900"
          >
            <X className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </header>

        <div className="scrollbar-slim min-h-0 flex-1 space-y-1 overflow-y-auto px-6 pb-5">
          {/* Créneau */}
          <Row icon={Clock}>
            <p className="text-[14px] font-medium text-ink-900">
              {capitalize(DATE_FORMAT.format(start))} · {TIME_FORMAT.format(start)} – {TIME_FORMAT.format(end)}
            </p>
            <p className="text-[12.5px] text-ink-400">Europe/Paris (GMT+02:00) · Ne se répète pas</p>
          </Row>

          {/* Invités */}
          <Row icon={Users}>
            <div className="rounded-xl bg-ground p-2.5">
              <p className="mb-1.5 px-1 text-[13px] text-ink-500">Inviter des participants</p>

              <div className="space-y-1">
                {guests.map((guest) => (
                  <span
                    key={guest}
                    className="flex w-fit items-center gap-2 rounded-full bg-card py-1 pr-1.5 pl-1.5 shadow-sm"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ground text-[10px] font-semibold text-ink-500 uppercase">
                      {guest.charAt(0)}
                    </span>
                    <span className="text-[13px] text-ink-900">{guest}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((current) => current.filter((item) => item !== guest))}
                      aria-label={`Retirer ${guest}`}
                      className="rounded-full p-0.5 text-ink-400 transition hover:bg-hover hover:text-ink-900"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </span>
                ))}
              </div>

              <label className="mt-2 flex cursor-pointer items-center gap-2 px-1 text-[12.5px] text-ink-500">
                <input
                  type="checkbox"
                  checked={hideGuests}
                  onChange={(event) => setHideGuests(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-line accent-eko-500"
                />
                Masquer la liste des participants
              </label>
            </div>
          </Row>

          {/* Visio */}
          <button
            type="button"
            onClick={() => setMeet((value) => !value)}
            className="flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-hover"
          >
            <span
              className={cx(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                meet ? 'bg-eko-500 text-white' : 'bg-warn/20 text-warn',
              )}
            >
              <Video className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className={cx('text-[14px]', meet ? 'font-medium text-ink-900' : 'text-ink-500')}>
              {meet ? 'Lien de visioconférence ajouté' : 'Ajouter un lien de visioconférence'}
            </span>
          </button>

          {/* Lieu */}
          <Row icon={MapPin}>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Lieu"
              className="w-full bg-transparent text-[14px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </Row>

          {/* Description */}
          <Row icon={AlignLeft}>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              placeholder="Ajouter une description"
              className="scrollbar-slim w-full resize-none rounded-xl bg-ground px-3 py-2.5 text-[13.5px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </Row>

          {/* Visibilité */}
          <Row icon={Eye}>
            <div className="flex items-center gap-2 rounded-xl bg-ground px-3 py-2 text-[12.5px] text-ink-500">
              Vous seul pouvez le voir
              <button type="button" className="font-medium text-ink-900 transition hover:text-eko-700">
                Rendre visible
              </button>
            </div>
          </Row>

          {/* Le message d'origine */}
          {conversation && (
            <Row icon={MessageSquare}>
              <button
                type="button"
                onClick={() => {
                  closeEventComposer()
                  navigate(`/reception/${conversation.id}`)
                }}
                className="flex items-center gap-2 rounded-full border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:text-ink-900"
              >
                Ouvrir le message · {getPlatform(conversation.platform).name}
              </button>
            </Row>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-line-soft px-6 py-4">
          <button
            type="button"
            onClick={closeEventComposer}
            className="rounded-full px-4 py-2 text-[13.5px] font-medium text-ink-500 transition hover:text-ink-900"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={save}
            className="rounded-full bg-ink-900 px-6 py-2.5 text-[13.5px] font-semibold text-white transition hover:opacity-90"
          >
            Enregistrer
          </button>
        </footer>
      </div>
    </div>
  )
}

function Row({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-1 py-2">
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink-400" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
