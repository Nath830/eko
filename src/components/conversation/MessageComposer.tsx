import {
  Bold,
  CalendarPlus,
  Image as ImageIcon,
  Italic,
  Mic,
  Paperclip,
  SendHorizontal,
  Sparkles,
  Square,
  Underline,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { getPlatform } from '../../config/platforms'
import { formatDuration } from '../../lib/conversations'
import { detectEventInText, slotSignature } from '../../lib/eventDetection'
import {
  appendTimeToText,
  findConflict,
  freeSlotsOfDay,
  isAvailabilityQuestion,
  rewriteSlotInText,
  spokenDay,
  spokenTime,
  suggestAlternatives,
} from '../../lib/scheduling'
import { flatten, readDate } from '../../lib/frenchDates'
import { useEventComposer } from '../../store/EventComposerContext'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { useToast } from '../../store/ToastContext'
import type { Attachment, Conversation } from '../../types'
import { EmojiPicker } from './EmojiPicker'
import { SlotPill } from './SlotPill'

interface MessageComposerProps {
  conversation: Conversation
  draft: string
  onDraftChange: (draft: string) => void
  /** Change quand un brouillon Eko est inséré : l'éditeur se resynchronise */
  draftNonce: number
  /** Eko est en train de rédiger une réponse */
  ekoDrafting: boolean
  /** Demande une autre proposition */
  onRegenerateDraft: () => void
}

/* Barre de saisie.

   Sur les mails : un vrai éditeur avec gras, italique, souligné et pièces
   jointes, comme dans une messagerie. Sur les autres plateformes, la mise en
   forme et les pièces jointes n'existent pas — seuls les emojis et le vocal
   restent, et le micro disparaît là où il n'a pas lieu d'être. */
export function MessageComposer({
  conversation,
  draft,
  onDraftChange,
  draftNonce,
  ekoDrafting,
  onRegenerateDraft,
}: MessageComposerProps) {
  const {
    sendMessage,
    sendVoiceMessage,
    detectionStatus,
    declineDetectedEvent,
    events,
    getContact,
  } = useEko()
  const { openEventComposer } = useEventComposer()
  const { notify } = useToast()
  const platform = getPlatform(conversation.platform)
  const isMail = conversation.platform === 'email'

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])

  /* Eko relit ce que vous écrivez : proposer un créneau fait apparaître la
     carte avant même l'envoi. La décision est retenue par créneau, pas par
     message : si vous envoyez sans avoir tranché, la carte réapparaît sous le
     message envoyé, et si vous avez déjà accepté, elle ne revient pas. */
  const slot = useMemo(() => detectEventInText(draft), [draft])
  const signature = slot ? slotSignature(conversation.id, slot.label, slot.start) : null
  const showSlot = slot !== null && signature !== null && !detectionStatus[signature]

  // Le créneau proposé est-il déjà pris ? Si oui, Eko en propose d'autres.
  const conflict = slot ? findConflict(events, slot.start, slot.end) : null
  const alternatives = useMemo(
    () => (slot && conflict ? suggestAlternatives(events, slot.start) : []),
    [slot?.start.getTime(), conflict?.id, events],
  )

  /* Une question de disponibilité — « tu es libre mercredi ? » — sans heure
     précise : Eko propose les créneaux libres de ce jour-là, à insérer d'un
     clic dans le message. */
  const askingAvailability = !slot && isAvailabilityQuestion(flatten(draft)) && draft.trim().length > 8
  const freeSlots = useMemo(
    () => (askingAvailability ? freeSlotsOfDay(events, readDate(flatten(draft))) : []),
    [askingAvailability, draft, events],
  )

  /** Insérer une heure dans le message, sans toucher au reste. */
  function insertTime(time: string) {
    const next = appendTimeToText(draft, time)
    onDraftChange(next)
    if (isMail && editorRef.current) editorRef.current.innerText = next
  }

  /** Choisir un autre créneau réécrit le message en cours. */
  function pickAlternative(start: Date) {
    onDraftChange(rewriteSlotInText(draft, start))
    if (isMail && editorRef.current) editorRef.current.innerText = rewriteSlotInText(draft, start)
  }

  /** Le créneau en cours d'écriture, sous la forme attendue par le store. */
  function draftEvent() {
    if (!slot || !signature) return null

    return {
      id: `brouillon-${signature}`,
      signature,
      conversationId: conversation.id,
      contactId: conversation.contactId,
      title: `${slot.label} avec ${conversation.title}`,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      sourceQuote: draft.replace(/\s+/g, ' ').trim(),
    }
  }

  /** Les personnes à convier : le contact, ou les membres du groupe. */
  function guestsOfConversation(): string[] {
    const ids = conversation.contactId ? [conversation.contactId] : (conversation.participantIds ?? [])

    return ids
      .map((id) => getContact(id))
      .filter((contact) => contact !== undefined)
      .map((contact) => {
        const email = contact.handles.find((handle) => handle.platform === 'email')
        return email?.handle ?? contact.fullName
      })
  }

  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timer = useRef<number | null>(null)

  const canSend = draft.trim().length > 0 || attachments.length > 0

  // Un brouillon Eko choisi remplit l'éditeur mis en forme.
  useEffect(() => {
    if (isMail && editorRef.current) {
      editorRef.current.innerText = draft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftNonce, conversation.id])

  useEffect(() => {
    setAttachments([])
  }, [conversation.id])

  useEffect(() => {
    if (!recording) return
    timer.current = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [recording])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!canSend) return

    sendMessage(conversation.id, {
      text: draft,
      html: isMail ? editorRef.current?.innerHTML : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    onDraftChange('')
    setAttachments([])
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && !isMail) {
      event.preventDefault()
      submit(event as unknown as FormEvent)
    }
  }

  /** Applique une mise en forme sans faire perdre le curseur à l'éditeur. */
  function format(command: 'bold' | 'italic' | 'underline') {
    editorRef.current?.focus()
    document.execCommand(command)
    onDraftChange(editorRef.current?.innerText ?? '')
  }

  function insertEmoji(emoji: string) {
    if (isMail && editorRef.current) {
      editorRef.current.focus()
      document.execCommand('insertText', false, emoji)
      onDraftChange(editorRef.current.innerText)
      return
    }
    onDraftChange(draft + emoji)
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>, asImage: boolean) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''

    for (const file of files) {
      const sizeLabel = file.size > 1_000_000 ? `${(file.size / 1_048_576).toFixed(1)} Mo` : `${Math.max(1, Math.round(file.size / 1024))} Ko`
      const attachment: Attachment = {
        id: `piece-${Date.now()}-${file.name}`,
        fileName: file.name,
        kind: asImage || file.type.startsWith('image/') ? 'image' : 'document',
        sizeLabel,
      }

      if (attachment.kind === 'image') {
        const reader = new FileReader()
        reader.onload = () => {
          setAttachments((current) =>
            current.map((item) => (item.id === attachment.id ? { ...item, previewUrl: String(reader.result) } : item)),
          )
        }
        reader.readAsDataURL(file)
      }

      setAttachments((current) => [...current, attachment])
    }
  }

  function stopRecording() {
    setRecording(false)
    sendVoiceMessage(conversation.id, Math.max(1, seconds))
    setSeconds(0)
  }

  if (recording) {
    return (
      <div className="shrink-0 border-t border-line-soft px-3 py-3 pb-safe md:px-4">
        <div className="flex max-w-3xl items-center gap-3 rounded-2xl border border-danger/30 bg-danger/5 px-3.5 py-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" aria-hidden />
          <span className="text-[13px] font-medium text-ink-900">Enregistrement…</span>

          <span className="flex h-7 flex-1 items-center gap-[2px]" aria-hidden>
            {Array.from({ length: 40 }, (_, index) => (
              <span
                key={index}
                className="w-[2px] shrink-0 animate-pulse rounded-full bg-danger/60"
                style={{ height: `${25 + ((index * 29 + seconds * 7) % 65)}%`, animationDelay: `${(index % 8) * 70}ms` }}
              />
            ))}
          </span>

          <span className="text-[12.5px] text-ink-700 tabular-nums">{formatDuration(seconds)}</span>

          <button
            type="button"
            onClick={() => {
              setRecording(false)
              setSeconds(0)
              notify('Enregistrement annulé')
            }}
            className="rounded-lg px-2 py-1 text-[12.5px] font-medium text-ink-500 transition hover:text-ink-900"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={stopRecording}
            aria-label="Envoyer le vocal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eko-500 text-white transition hover:bg-eko-600"
          >
            <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="shrink-0 border-t border-line-soft px-3 py-3 pb-safe md:px-4">
      {/* Les créneaux se posent au-dessus de la zone de saisie, pas dedans */}
      {askingAvailability && freeSlots.length > 0 && (
        <div className="mb-2 flex max-w-3xl flex-wrap items-center gap-1.5">
          {freeSlots.map((free) => (
            <SlotPill
              key={free.start.toISOString()}
              label={spokenTime(free.start)}
              free
              onClick={() => insertTime(spokenTime(free.start))}
            />
          ))}
          <span className="text-[11.5px] text-ink-400">à insérer dans votre message</span>
        </div>
      )}

      {/* Un créneau précis : libre, ou occupé avec d'autres propositions */}
      {showSlot && slot && (
        <div className="mb-2 flex max-w-3xl flex-wrap items-center gap-1.5">
          <SlotPill label={`${spokenDay(slot.start)} ${spokenTime(slot.start)}`} free={!conflict} />

          {!conflict ? (
            <button
            type="button"
            onClick={() => {
              const event = draftEvent()
              if (!event) return

              openEventComposer({
                title: event.title,
                start: event.start,
                end: event.end,
                contactId: event.contactId,
                conversationId: conversation.id,
                signature: event.signature,
                guests: guestsOfConversation(),
              })
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-eko-500 px-2.5 py-1 text-[12px] font-medium text-white transition hover:bg-eko-600"
            >
            <CalendarPlus className="h-3 w-3" aria-hidden />
            Ajouter
            </button>
          ) : (
            <>
            <span className="text-[11.5px] text-ink-500">{conflict.title} · plutôt</span>

            {alternatives.map((alternative) => (
              <SlotPill
                key={alternative.start.toISOString()}
                label={`${spokenDay(alternative.start)} ${spokenTime(alternative.start)}`}
                free
                onClick={() => pickAlternative(alternative.start)}
              />
            ))}

            {alternatives.length === 0 && (
              <span className="text-[11.5px] text-ink-500">aucun créneau libre ces jours-ci</span>
            )}
            </>
          )}

          <button
          type="button"
          onClick={() => {
            const event = draftEvent()
            if (event) declineDetectedEvent(event)
          }}
          aria-label="Ignorer la proposition"
          className="shrink-0 rounded-lg p-1 text-ink-400 transition hover:bg-hover hover:text-ink-900"
          >
          <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      )}

      <div className="max-w-3xl rounded-2xl border border-line bg-ground transition focus-within:border-eko-500/50 focus-within:bg-card">
        {/* Pièces jointes en attente d'envoi */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-line-soft p-2.5">
            {attachments.map((attachment) => (
              <span
                key={attachment.id}
                className="flex items-center gap-2 rounded-xl border border-line bg-card py-1.5 pr-1.5 pl-2.5"
              >
                {attachment.previewUrl ? (
                  <img src={attachment.previewUrl} alt="" className="h-7 w-7 rounded-md object-cover" />
                ) : (
                  <Paperclip className="h-3.5 w-3.5 text-ink-400" aria-hidden />
                )}
                <span className="max-w-[160px] truncate text-[12px] text-ink-900">{attachment.fileName}</span>
                <span className="text-[11px] text-ink-400">{attachment.sizeLabel}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}
                  aria-label={`Retirer ${attachment.fileName}`}
                  className="rounded-md p-1 text-ink-400 transition hover:bg-hover hover:text-danger"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* La zone d'écriture */}
        {isMail ? (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label={`Écrire à ${conversation.title}`}
            onInput={(event) => onDraftChange(event.currentTarget.innerText)}
            data-placeholder={platform.composerPlaceholder}
            className="scrollbar-slim max-h-64 min-h-[104px] overflow-y-auto px-3.5 py-3 text-[14px] leading-relaxed text-ink-900 focus:outline-none empty:before:text-ink-400 empty:before:content-[attr(data-placeholder)]"
          />
        ) : (
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder={platform.composerPlaceholder}
            aria-label={`Écrire à ${conversation.title}`}
            className="scrollbar-slim max-h-64 min-h-[92px] w-full resize-none bg-transparent px-3.5 py-3 text-[14px] leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        )}

        {/* La barre d'outils */}
        <div className="flex items-center gap-1 border-t border-line-soft px-2 py-1.5">
          {isMail && (
            <>
              <ToolButton label="Gras" onClick={() => format('bold')}>
                <Bold className="h-[15px] w-[15px]" aria-hidden />
              </ToolButton>
              <ToolButton label="Italique" onClick={() => format('italic')}>
                <Italic className="h-[15px] w-[15px]" aria-hidden />
              </ToolButton>
              <ToolButton label="Souligné" onClick={() => format('underline')}>
                <Underline className="h-[15px] w-[15px]" aria-hidden />
              </ToolButton>

              <span className="mx-1 h-5 w-px bg-line" aria-hidden />

              <ToolButton label="Joindre un fichier" onClick={() => fileInput.current?.click()}>
                <Paperclip className="h-[15px] w-[15px]" aria-hidden />
              </ToolButton>
              <ToolButton label="Joindre une image" onClick={() => imageInput.current?.click()}>
                <ImageIcon className="h-[15px] w-[15px]" aria-hidden />
              </ToolButton>

              <input ref={fileInput} type="file" multiple hidden onChange={(event) => addFiles(event, false)} />
              <input
                ref={imageInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => addFiles(event, true)}
              />

              <span className="mx-1 h-5 w-px bg-line" aria-hidden />
            </>
          )}

          <EmojiPicker onPick={insertEmoji} />

          {/* Eko a déjà rempli le champ : ce bouton en propose une autre version */}
          <button
            type="button"
            onClick={onRegenerateDraft}
            disabled={ekoDrafting}
            title="Faire réécrire la réponse par Eko"
            className={cx(
              'flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] font-medium transition',
              ekoDrafting ? 'text-eko-600' : 'text-ink-500 hover:bg-hover hover:text-ink-900',
            )}
          >
            <Sparkles className={cx('h-[15px] w-[15px]', ekoDrafting && 'animate-pulse')} aria-hidden />
            {ekoDrafting ? 'Eko rédige…' : 'Réécrire'}
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {platform.supportsVoice ? (
              <button
                type="button"
                onClick={() => setRecording(true)}
                aria-label="Enregistrer un message vocal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-500 transition hover:border-eko-500/40 hover:text-eko-600"
              >
                <Mic className="h-[17px] w-[17px]" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                disabled
                title={`${platform.name} n'accepte pas les messages vocaux`}
                aria-label={`${platform.name} n'accepte pas les messages vocaux`}
                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-line bg-ground text-ink-200"
              >
                <Mic className="h-[17px] w-[17px]" aria-hidden />
              </button>
            )}

            <button
              type="submit"
              disabled={!canSend}
              aria-label="Envoyer"
              className={cx(
                'flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition',
                canSend ? 'bg-eko-500 text-white hover:bg-eko-600' : 'bg-ground text-ink-200',
              )}
            >
              Envoyer
              <SendHorizontal className="h-[15px] w-[15px]" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      // On garde la sélection dans l'éditeur au moment du clic
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-hover hover:text-ink-900"
    >
      {children}
    </button>
  )
}
