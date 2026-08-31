import {
  ArrowUp,
  Bell,
  CalendarPlus,
  Check,
  CornerDownLeft,
  FolderOpen,
  ListChecks,
  MailOpen,
  Sparkles,
  UserSearch,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { detectCommand } from '../../lib/assistantCommands'
import { AssistantAlerts } from './AssistantAlerts'
import { AssistantBrief } from './AssistantBrief'
import { AssistantDossier } from './AssistantDossier'
import { AssistantSend } from '../chat/AssistantSend'
import { AssistantMissed } from './AssistantMissed'
import { runSearch } from '../../lib/naturalSearch'
import { excerptAround } from '../../lib/search'
import { cx } from '../../lib/cx'
import { formatListTimestamp } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import { useToast } from '../../store/ToastContext'
import { EkoWordmark } from '../ui/EkoMark'
import { HighlightedText } from '../ui/HighlightedText'
import { PlatformLogo } from '../ui/PlatformLogo'

/* Les raccourcis proposés quand la barre est vide.

   Un libellé court, et la phrase complète qu'Eko recevra : cliquer exécute
   vraiment la demande, tout en laissant la phrase visible et modifiable. */
const SHORTCUTS: { label: string; icon: typeof ListChecks; ask: string }[] = [
  {
    label: 'Mes priorités',
    icon: ListChecks,
    ask: 'quelles sont mes priorités pour le reste de la journée ?',
  },
  { label: 'Récap du jour', icon: Sparkles, ask: 'fais-moi un récap des derniers messages' },
  { label: 'Où en est Vertex ?', icon: FolderOpen, ask: 'où en est le projet Vertex ?' },
  { label: 'Ce que j’ai raté', icon: MailOpen, ask: 'qu’est-ce que j’ai raté ?' },
  { label: 'Mes alertes', icon: Bell, ask: 'mes alertes' },
  { label: 'Poser un rendez-vous', icon: CalendarPlus, ask: 'mets un rdv avec Julien jeudi 14h' },
  { label: 'Retrouver quelqu’un', icon: UserSearch, ask: 'la discussion avec un client dont je ne me souviens plus du nom' },
]

/* La barre du haut : on parle à Eko normalement.

   Elle accepte aussi bien un mot-clé qu'une description vague — « le client
   pour qui je fais l'identité » — et répond par une phrase avant de montrer
   les conversations trouvées. */
interface SearchBarProps {
  /** Fourni par l'accueil : la conversation s'ouvre dans le panneau de droite
      au lieu d'emmener vers la réception. */
  onOpenConversation?: (conversationId: string, messageId?: string) => void
  /** Comment afficher la réponse d'Eko.
      'floating' : en surimpression sous la barre, pour l'application.
      'inline'   : à la suite, sous la barre, pour la page d'accueil — la
                   réponse se lit alors de haut en bas, sans rien recouvrir. */
  layout?: 'floating' | 'inline'
}

export function SearchBar({ layout = 'floating', onOpenConversation }: SearchBarProps) {
  const { conversations, contacts, filters, setFilter, createEvent, createAlert } = useEko()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const query = filters.query

  // Un ordre l'emporte sur une recherche : « mets un rdv… » n'est pas une question.
  const command = useMemo(() => detectCommand(query, contacts), [query, contacts])

  // Les ordres qui demandent une confirmation avant d'agir.
  const actionCommand = command?.kind === 'event' || command?.kind === 'alert' ? command : null

  const outcome = useMemo(
    () => (command ? { kind: 'empty' as const, results: [] } : runSearch(query, conversations, contacts)),
    [command, query, conversations, contacts],
  )

  /** Exécute l'ordre reconnu, puis vide la barre. */
  function runCommand() {
    const command = actionCommand
    if (!command) return

    if (command.kind === 'event') {
      createEvent({
        title: command.title,
        start: command.start,
        end: command.end,
        contactId: command.contactId,
      })
      notify(`${command.title} ajouté à votre agenda`, {
        tone: 'success',
        to: '/calendrier',
        actionLabel: 'Voir le calendrier',
      })
    } else {
      createAlert({ query: command.query, contactId: command.contactId, scope: command.scope })
      notify('Alerte créée — Eko surveille vos conversations', { tone: 'eko' })
    }

    setFilter('query', '')
    setOpen(false)
  }

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function openResult(conversationId: string, messageId?: string) {
    setOpen(false)

    if (onOpenConversation) {
      onOpenConversation(conversationId, messageId)
      return
    }

    navigate(messageId ? `/reception/${conversationId}?message=${messageId}` : `/reception/${conversationId}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Escape') setOpen(false)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (actionCommand) {
        runCommand()
        return
      }
      const first = outcome.results[0]
      if (first) openResult(first.conversation.id, first.message?.id)
    }
  }

  return (
    <div ref={container} className={cx('mx-auto w-full max-w-[560px]', layout === 'floating' && 'relative')}>
      {/* Le champ : court en largeur, généreux en hauteur */}
      <div
        className={cx(
          'card rounded-3xl px-4 pt-3 pb-2.5 transition',
          open && 'ring-2 ring-eko-500/25',
        )}
      >
        <div className="flex items-start gap-2.5">
          <EkoWordmark height={14} className="mt-1.5 shrink-0 text-ink-900" />

          <textarea
            value={query}
            rows={2}
            onChange={(event) => {
              setFilter('query', event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Demandez à Eko : un récap, vos priorités, un rendez-vous, une alerte…"
            aria-label="Demander à Eko"
            className="scrollbar-slim max-h-28 min-h-[46px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="min-w-0 flex-1 truncate text-[11px] text-ink-400">
            Récap, priorités, rendez-vous, alertes — ou une simple recherche
          </span>

          {query && (
            <button
              type="button"
              onClick={() => {
                setFilter('query', '')
                setOpen(false)
              }}
              aria-label="Effacer"
              className="rounded-full p-1.5 text-ink-400 transition hover:bg-hover hover:text-ink-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(true)
              if (actionCommand) {
                runCommand()
                return
              }
              const first = outcome.results[0]
              if (query && first) openResult(first.conversation.id, first.message?.id)
            }}
            aria-label="Demander"
            className={cx(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
              query ? 'bg-ink-900 text-white hover:opacity-90' : 'bg-ground text-ink-200',
            )}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* La réponse d'Eko et les conversations trouvées */}
      {open && (
        <div
          className={cx(
            'card overflow-hidden rounded-3xl',
            layout === 'floating'
              ? 'absolute inset-x-0 top-[calc(100%+8px)] z-40 max-h-[62vh]'
              : 'mt-3',
          )}
        >
          {!query && (
            <div className="px-3 py-2.5">
              <p className="mb-1.5 px-0.5 text-[10.5px] font-semibold tracking-wider text-ink-400 uppercase">
                Me demander
              </p>

              <div className="flex flex-wrap gap-1.5">
                {SHORTCUTS.map((shortcut) => {
                  const Icon = shortcut.icon

                  return (
                    <button
                      key={shortcut.label}
                      type="button"
                      title={shortcut.ask}
                      onClick={() => setFilter('query', shortcut.ask)}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:bg-eko-50 hover:text-eko-700"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-eko-600" aria-hidden />
                      {shortcut.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Un récapitulatif demandé : Eko rédige et répond */}
          {command?.kind === 'brief' && <AssistantBrief kind={command.brief} onOpen={() => setOpen(false)} />}

          {/* Les alertes se consultent ici, elles n'ont plus d'écran à elles */}
          {command?.kind === 'alerts' && <AssistantAlerts onOpen={openResult} />}

          {/* Les non-lus et les messages restés sans réponse */}
          {command?.kind === 'missed' && <AssistantMissed onOpen={openResult} />}

          {/* Le point complet sur un sujet, recousu depuis toutes les plateformes */}
          {command?.kind === 'dossier' && (
            <AssistantDossier dossierId={command.dossierId} onOpen={openResult} />
          )}

          {/* Un ordre reconnu : Eko montre ce qu'il a compris avant d'agir */}
          {command?.kind === 'send' && (
            <div className="p-3.5">
              <AssistantSend
                contactId={command.contactId}
                documentHint={command.documentHint}
                withSummary={command.withSummary}
                onOpen={openResult}
              />
            </div>
          )}

          {actionCommand && (
            <div className="p-3.5">
              <div className="surface-eko rounded-2xl border p-3.5">
                <div className="mb-2.5 flex items-center gap-2">
                  {actionCommand.kind === 'event' ? (
                    <CalendarPlus className="h-4 w-4 text-eko-600" aria-hidden />
                  ) : (
                    <Bell className="h-4 w-4 text-eko-600" aria-hidden />
                  )}
                  <span className="text-[12px] font-semibold text-eko-700">
                    {actionCommand.kind === 'event' ? 'Rendez-vous à ajouter' : 'Alerte à créer'}
                  </span>
                </div>

                <p className="text-[14px] font-medium text-ink-900">
                  {actionCommand.kind === 'event' ? actionCommand.title : `« ${actionCommand.query} »`}
                </p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-600">{actionCommand.summary}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={runCommand}
                    className="flex items-center gap-1.5 rounded-xl bg-eko-500 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-eko-600"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    {actionCommand.kind === 'event' ? "Ajouter à l'agenda" : "Créer l'alerte"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilter('query', '')
                      setOpen(false)
                    }}
                    className="rounded-xl px-3 py-2 text-[13px] font-medium text-ink-500 transition hover:text-ink-900"
                  >
                    Annuler
                  </button>

                  <span className="ml-auto text-[11px] text-ink-400">Entrée pour valider</span>
                </div>
              </div>
            </div>
          )}

          {!command && query && outcome.kind === 'empty' && (
            <div className="px-5 py-6 text-center">
              <p className="text-[13.5px] font-medium text-ink-900">Je ne trouve rien pour « {query} »</p>
              <p className="mx-auto mt-1 max-w-xs text-[12.5px] leading-relaxed text-ink-500">
                Essayez de me dire qui c'est, de quoi ça parlait, ou sur quelle plateforme ça se passait.
              </p>
            </div>
          )}

          {!command && query && outcome.results.length > 0 && (
            <div className={cx('scrollbar-slim', layout === 'floating' && 'max-h-[58vh] overflow-y-auto')}>
              {/* Eko répond d'abord par une phrase */}
              {outcome.answer && (
                <div className="surface-eko border-b p-3.5">
                  <div className="flex gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-eko-600" aria-hidden />
                    <p className="text-[13px] leading-relaxed text-ink-800">{outcome.answer}</p>
                  </div>
                </div>
              )}

              {!outcome.answer && outcome.interpretation && (
                <div className="surface-eko border-b px-3.5 py-2.5">
                  <p className="text-[12.5px] text-ink-700">{outcome.interpretation}</p>
                </div>
              )}

              <ul className="p-2">
                {outcome.results.map(({ conversation, message }) => (
                  <li key={`${conversation.id}-${message?.id ?? 'aucun'}`}>
                    <div className="flex items-start gap-3 rounded-2xl px-2.5 py-2.5 transition hover:bg-hover">
                      <PlatformLogo platform={conversation.platform} size={19} className="mt-0.5 shrink-0" />

                      <button
                        type="button"
                        onClick={() => openResult(conversation.id, message?.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[13.5px] font-medium text-ink-900">{conversation.title}</span>
                          {message && (
                            <span className="ml-auto shrink-0 text-[11px] text-ink-400">
                              {formatListTimestamp(message.sentAt)}
                            </span>
                          )}
                        </span>
                        <span className="line-clamp-2 block text-[12.5px] text-ink-500">
                          {message ? (
                            <HighlightedText
                              text={excerptAround(message.text ?? message.voice?.transcript ?? '', query, 60)}
                              query={query}
                            />
                          ) : (
                            conversation.ekoDigest
                          )}
                        </span>
                      </button>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openResult(conversation.id, message?.id)}
                          title="Ouvrir au bon message"
                          className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ground hover:text-ink-900"
                        >
                          <CornerDownLeft className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
