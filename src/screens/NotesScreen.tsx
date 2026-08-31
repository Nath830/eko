import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { MentionChip } from '../components/notes/MentionChip'
import { MentionPicker } from '../components/notes/MentionPicker'
import { EkoTag } from '../components/ui/EkoTag'
import { cx } from '../lib/cx'
import { formatDaySeparator } from '../lib/date'
import { useEko } from '../store/EkoStore'
import { useToast } from '../store/ToastContext'

/** Notes libres, et notes rattachées à une conversation ou à un contact. */
export function NotesScreen() {
  const { notes, createNote, updateNote, deleteNote, addMention, removeMention, getContact, getConversation } =
    useEko()
  const { notify } = useToast()

  const [selectedId, setSelectedId] = useState<string | null>(notes[0]?.id ?? null)
  const selected = notes.find((note) => note.id === selectedId)

  function addNote() {
    const id = createNote({ title: 'Nouvelle note', body: '' })
    setSelectedId(id)
    notify('Note créée', { tone: 'success' })
  }

  return (
    <ScreenFrame
      title="Notes"
      subtitle={`${notes.length} notes, dont ${notes.filter((note) => note.author === 'eko').length} consignées par Eko`}
      actions={
        <button
          type="button"
          onClick={addNote}
          className="flex items-center gap-1.5 rounded-full bg-eko-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-eko-600"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Nouvelle note
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ul className="space-y-1.5">
          {notes.map((note) => {
            const contact = getContact(note.contactId)

            return (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(note.id)}
                  className={cx(
                    'w-full rounded-2xl border p-3 text-left transition',
                    note.id === selectedId ? 'border-eko-500/40 bg-eko-50' : 'border-line bg-card hover:shadow-sm',
                  )}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-ink-900">{note.title ?? 'Note'}</span>
                    {note.author === 'eko' && <EkoTag className="ml-auto shrink-0">Eko</EkoTag>}
                  </div>
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-500">
                    {note.body || 'Note vide'}
                  </p>
                  <p className="mt-1.5 text-[11px] text-ink-400">
                    {formatDaySeparator(note.createdAt)}
                    {contact && ` · ${contact.fullName}`}
                    {note.mentions && note.mentions.length > 0 && ` · ${note.mentions.length} citations`}
                  </p>
                </button>
              </li>
            )
          })}
        </ul>

        {selected ? (
          <div className="rounded-2xl border border-line bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={selected.title ?? ''}
                onChange={(event) => updateNote(selected.id, { title: event.target.value })}
                readOnly={selected.author === 'eko'}
                placeholder="Titre de la note"
                className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />

              {selected.author === 'eko' ? (
                <EkoTag>Consignée par Eko</EkoTag>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    deleteNote(selected.id)
                    setSelectedId(null)
                    notify('Note supprimée')
                  }}
                  aria-label="Supprimer la note"
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-hover hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>

            {/* Ce que la note cite : Eko s'en sert pour la rattacher au dossier */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {selected.author === 'me' && (
                <MentionPicker onPick={(mention) => addMention(selected.id, mention)} />
              )}

              {(selected.mentions ?? []).map((mention) => (
                <MentionChip
                  key={`${mention.kind}-${mention.id}`}
                  mention={mention}
                  onRemove={selected.author === 'me' ? () => removeMention(selected.id, mention) : undefined}
                />
              ))}

              {(selected.mentions ?? []).length === 0 && selected.author === 'me' && (
                <span className="text-[11.5px] text-ink-400">
                  Citez une personne, un sujet ou une conversation : Eko rattachera cette note au bon dossier.
                </span>
              )}
            </div>

            {(selected.contactId || selected.conversationId) && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {selected.contactId && (
                  <Link
                    to={`/contacts/${selected.contactId}`}
                    className="rounded-full bg-ground px-2.5 py-1 text-[11.5px] text-ink-700 transition hover:text-ink-900"
                  >
                    {getContact(selected.contactId)?.fullName}
                  </Link>
                )}
                {selected.conversationId && (
                  <Link
                    to={`/reception/${selected.conversationId}`}
                    className="rounded-full bg-ground px-2.5 py-1 text-[11.5px] text-ink-700 transition hover:text-ink-900"
                  >
                    {getConversation(selected.conversationId)?.title}
                  </Link>
                )}
              </div>
            )}

            <textarea
              value={selected.body}
              onChange={(event) => updateNote(selected.id, { body: event.target.value })}
              readOnly={selected.author === 'eko'}
              rows={18}
              placeholder="Écrivez ici…"
              className="scrollbar-slim w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-ink-700 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-line bg-ground/60 py-16 text-center">
            <p className="text-[13px] text-ink-500">Sélectionnez une note, ou créez-en une.</p>
          </div>
        )}
      </div>
    </ScreenFrame>
  )
}
