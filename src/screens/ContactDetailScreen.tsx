import { ArrowLeft, Bell, CalendarDays, Check, FileText, MessageSquare, Pencil, StickyNote } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CrossChannelSummary } from '../components/context/CrossChannelSummary'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { Avatar } from '../components/ui/Avatar'
import { EkoTag } from '../components/ui/EkoTag'
import { PlatformLogo } from '../components/ui/PlatformLogo'
import { conversationsOfContact, lastMessage } from '../lib/conversations'
import { cx } from '../lib/cx'
import { formatDaySeparator, formatListTimestamp } from '../lib/date'
import { buildContactTimeline } from '../lib/timeline'
import { useEko } from '../store/EkoStore'
import type { TimelineKind } from '../types'

const TIMELINE_ICONS: Record<TimelineKind, typeof MessageSquare> = {
  message: MessageSquare,
  attachment: FileText,
  event: CalendarDays,
  note: StickyNote,
  alert: Bell,
}

/** Fiche complète d'un contact : identité, plateformes, résumé Eko,
    conversations, notes, pièces jointes et historique. */
export function ContactDetailScreen() {
  const { contactId } = useParams()
  const { getContact, conversations, notes, events, alertHits, updateContactSummary } = useEko()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')

  const contact = getContact(contactId)

  if (!contact) {
    return (
      <ScreenFrame title="Contact introuvable">
        <Link to="/contacts" className="text-[13px] font-medium text-eko-600">
          Retour au répertoire
        </Link>
      </ScreenFrame>
    )
  }

  const related = conversationsOfContact(conversations, contact.id)
  const contactNotes = notes.filter((note) => note.contactId === contact.id)
  const attachments = related.flatMap((conversation) =>
    conversation.messages.flatMap((message) =>
      (message.attachments ?? []).map((attachment) => ({ attachment, conversation, sentAt: message.sentAt })),
    ),
  )
  const timeline = buildContactTimeline(contact.id, { conversations, notes, events, alertHits })

  return (
    <ScreenFrame
      title={contact.fullName}
      subtitle={[contact.role, contact.company].filter(Boolean).join(' · ')}
      actions={
        <Link
          to="/contacts"
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Répertoire
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-5">
          {/* Identité et plateformes */}
          <section className="rounded-2xl border border-line bg-card p-4">
            <div className="flex items-center gap-3.5">
              <Avatar photo={contact.photo} title={contact.fullName} size={52} />
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-ink-900">{contact.fullName}</p>
                <p className="text-[12.5px] text-ink-500">
                  {[contact.role, contact.company].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <h3 className="mt-4 mb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
              Vous échangez sur {contact.handles.length} plateformes
            </h3>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {contact.handles.map((handle) => (
                <div key={handle.platform} className="flex items-center gap-2 rounded-xl bg-ground px-2.5 py-2">
                  <PlatformLogo platform={handle.platform} size={16} />
                  <span className="truncate text-[12.5px] text-ink-700">{handle.handle}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Résumé Eko modifiable */}
          <section className="rounded-2xl border border-line bg-ground/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              {contact.summaryEditedByUser ? (
                <span className="text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  Modifié par vous
                </span>
              ) : (
                <EkoTag>Résumé Eko</EkoTag>
              )}

              <button
                type="button"
                onClick={() => {
                  setText(contact.ekoSummary)
                  setEditing((value) => !value)
                }}
                className="ml-auto flex items-center gap-1 text-[12px] font-medium text-ink-500 transition hover:text-ink-900"
              >
                <Pencil className="h-3 w-3" aria-hidden />
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-2">
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  className="scrollbar-slim w-full resize-none rounded-xl border border-line bg-card p-2.5 text-[13px] leading-relaxed focus:border-eko-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateContactSummary(contact.id, text.trim())
                    setEditing(false)
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-eko-500 px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-eko-600"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Enregistrer
                </button>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-ink-700">{contact.ekoSummary}</p>
            )}
          </section>

          {/* Conversations */}
          <section>
            <h3 className="mb-2 text-[12px] font-semibold tracking-wider text-ink-400 uppercase">Conversations</h3>
            <ul className="space-y-1.5">
              {related.map((conversation) => {
                const last = lastMessage(conversation)
                return (
                  <li key={conversation.id}>
                    <Link
                      to={`/reception/${conversation.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3 transition hover:shadow-sm"
                    >
                      <PlatformLogo platform={conversation.platform} size={17} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink-900">
                          {conversation.title}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-500">{conversation.ekoDigest}</span>
                      </span>
                      <span className="shrink-0 text-[11.5px] text-ink-400">
                        {last ? formatListTimestamp(last.sentAt) : ''}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* Pièces jointes */}
          {attachments.length > 0 && (
            <section>
              <h3 className="mb-2 text-[12px] font-semibold tracking-wider text-ink-400 uppercase">
                Pièces jointes échangées
              </h3>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {attachments.map(({ attachment, conversation, sentAt }) => (
                  <li key={`${attachment.id}-${sentAt}`}>
                    <Link
                      to={`/reception/${conversation.id}`}
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-card p-2.5 transition hover:shadow-sm"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ground text-ink-500">
                        <FileText className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-medium text-ink-900">
                          {attachment.fileName}
                        </span>
                        <span className="block text-[11px] text-ink-400">
                          {attachment.sizeLabel} · {formatListTimestamp(sentAt)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Colonne de droite : résumé transversal, notes, historique */}
        <div className="space-y-5">
          <CrossChannelSummary contactId={contact.id} contactName={contact.fullName} />

          <section>
            <h3 className="mb-2 text-[12px] font-semibold tracking-wider text-ink-400 uppercase">Notes liées</h3>
            {contactNotes.length === 0 ? (
              <p className="text-[12.5px] text-ink-500">Aucune note.</p>
            ) : (
              <ul className="space-y-1.5">
                {contactNotes.map((note) => (
                  <li key={note.id} className={cx('rounded-2xl border p-3', note.author === 'eko' ? 'surface-eko' : 'border-line bg-card')}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[12.5px] font-medium text-ink-900">{note.title ?? 'Note'}</span>
                      {note.author === 'eko' && <EkoTag className="ml-auto">Eko</EkoTag>}
                    </div>
                    <p className="line-clamp-4 text-[12px] leading-relaxed whitespace-pre-line text-ink-700">
                      {note.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-[12px] font-semibold tracking-wider text-ink-400 uppercase">
              Historique · tous canaux
            </h3>
            <ol className="relative space-y-3 border-l border-line pl-4">
              {timeline.map((entry) => {
                const Icon = TIMELINE_ICONS[entry.kind]
                const content = (
                  <>
                    <span className="absolute -left-[21px] flex h-4 w-4 items-center justify-center rounded-full border border-line bg-card">
                      <Icon className="h-2.5 w-2.5 text-ink-400" aria-hidden />
                    </span>
                    <span className="block text-[11px] text-ink-400">{formatDaySeparator(entry.date)}</span>
                    <span className="block text-[12.5px] font-medium text-ink-900">{entry.title}</span>
                    {entry.detail && <span className="block truncate text-[12px] text-ink-500">{entry.detail}</span>}
                  </>
                )

                return (
                  <li key={entry.id} className="relative">
                    {entry.conversationId ? (
                      <Link to={`/reception/${entry.conversationId}`} className="block transition hover:opacity-80">
                        {content}
                      </Link>
                    ) : (
                      <div>{content}</div>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        </div>
      </div>
    </ScreenFrame>
  )
}
