import { CalendarPlus, Check, Link2, Loader2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { EkoTag } from '../components/ui/EkoTag'
import { PlatformLogo } from '../components/ui/PlatformLogo'
import { cx } from '../lib/cx'
import { formatTime } from '../lib/date'
import { useEko } from '../store/EkoStore'
import { useEventComposer } from '../store/EventComposerContext'
import { useToast } from '../store/ToastContext'
import type { CalendarEvent } from '../types'

type View = 'week' | 'month'

const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const MONTH_FORMAT = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = (result.getDay() + 6) % 7
  result.setDate(result.getDate() - day)
  result.setHours(0, 0, 0, 0)
  return result
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

/** Calendrier : vues semaine et mois, connexion Google simulée, et les
    rendez-vous détectés par Eko dans les messages. */
export function CalendarScreen() {
  const {
    googleConnected,
    connectingGoogle,
    connectGoogle,
    events,
    proposals,
    declineProposal,
    detectedEvents,
    declineDetectedEvent,
    getConversation,
  } = useEko()
  const { notify } = useToast()
  const { openEventComposer } = useEventComposer()
  const [view, setView] = useState<View>('week')

  const today = new Date()
  const weekStart = useMemo(() => startOfWeek(today), [today.toDateString()])
  const pending = proposals.filter((proposal) => proposal.status === 'pending')
  const hasProposals = pending.length > 0 || detectedEvents.length > 0

  const days = useMemo(() => {
    if (view === 'week') return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))

    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    const gridStart = startOfWeek(first)
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [view, weekStart, today.getFullYear(), today.getMonth()])

  function eventsOn(day: Date): CalendarEvent[] {
    return events
      .filter((event) => sameDay(new Date(event.start), day))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }

  return (
    <ScreenFrame
      title="Calendrier"
      subtitle={MONTH_FORMAT.format(today)}
      actions={
        <div className="flex gap-1 rounded-full bg-ground p-1">
          {(['week', 'month'] as View[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={cx(
                'rounded-full px-3 py-1.5 text-[12.5px] font-medium transition',
                view === option ? 'bg-card text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-900',
              )}
            >
              {option === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Bandeau de connexion */}
        {!googleConnected && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-ground/60 p-4">
            <Link2 className="h-4 w-4 shrink-0 text-ink-500" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-ink-900">Connecter Google Calendar</p>
              <p className="text-[12.5px] text-ink-500">
                Vos rendez-vous existants apparaîtront ici, à côté de ceux détectés par Eko.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                await connectGoogle()
                notify('Google Calendar connecté', { tone: 'success' })
              }}
              disabled={connectingGoogle}
              className="flex items-center gap-2 rounded-xl bg-ink-900 px-3.5 py-2 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {connectingGoogle ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Connexion…
                </>
              ) : (
                'Connecter'
              )}
            </button>
          </div>
        )}

        {/* Propositions détectées par Eko */}
        {hasProposals && (
          <section className="surface-eko rounded-2xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarPlus className="h-4 w-4 text-eko-600" aria-hidden />
              <h2 className="text-[13.5px] font-semibold text-eko-700">
                Propositions détectées dans vos messages
              </h2>
              <EkoTag className="ml-auto">Eko</EkoTag>
            </div>

            <ul className="space-y-2">
              {pending.map((proposal) => {
                const conversation = getConversation(proposal.conversationId)

                return (
                  <li key={proposal.id} className="rounded-xl bg-card p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {conversation && <PlatformLogo platform={conversation.platform} size={15} />}
                      <span className="text-[13px] font-medium text-ink-900">{proposal.title}</span>
                      <span className="text-[12px] text-ink-500">
                        {new Date(proposal.start).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}{' '}
                        à {formatTime(proposal.start)}
                      </span>
                    </div>

                    <p className="mt-1 text-[11.5px] text-ink-500 italic">« {proposal.sourceQuote} »</p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEventComposer({
                            title: proposal.title,
                            start: proposal.start,
                            end: proposal.end,
                            contactId: proposal.contactId,
                            conversationId: proposal.conversationId,
                            guests: [],
                          })
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-eko-500 px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-eko-600"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          declineProposal(proposal.id)
                          notify('Proposition écartée')
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-500 transition hover:text-ink-900"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden />
                        Ignorer
                      </button>
                      {conversation && (
                        <Link
                          to={`/reception/${conversation.id}`}
                          className="text-[12.5px] font-medium text-eko-600 transition hover:text-eko-700"
                        >
                          Voir le message
                        </Link>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Ceux qu'Eko a repérés tout seul dans les messages */}
            {detectedEvents.length > 0 && (
              <ul className="mt-2 space-y-2">
                {detectedEvents.map((event) => {
                  const conversation = getConversation(event.conversationId)
                  const start = new Date(event.start)

                  return (
                    <li key={event.id} className="rounded-xl bg-card p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {conversation && <PlatformLogo platform={conversation.platform} size={15} />}
                        <span className="text-[13px] font-medium text-ink-900">{event.title}</span>
                        <span className="text-[12px] text-ink-500">
                          {start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à{' '}
                          {formatTime(event.start)}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-[11.5px] text-ink-500 italic">« {event.sourceQuote} »</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEventComposer({
                              title: event.title,
                              start: event.start,
                              end: event.end,
                              contactId: event.contactId,
                              conversationId: event.conversationId,
                              signature: event.signature,
                              guests: [],
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-eko-500 px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-eko-600"
                        >
                          <Check className="h-3.5 w-3.5" aria-hidden />
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => declineDetectedEvent(event)}
                          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-500 transition hover:text-ink-900"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                          Ignorer
                        </button>
                        {conversation && (
                          <Link
                            to={`/reception/${conversation.id}?message=${event.id}`}
                            className="text-[12.5px] font-medium text-eko-600 transition hover:text-eko-700"
                          >
                            Voir le message
                          </Link>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )}

        {/* Grille */}
        <section
          className={cx(
            'grid gap-2',
            view === 'week' ? 'grid-cols-1 sm:grid-cols-7' : 'grid-cols-7',
          )}
        >
          {view === 'month' &&
            DAY_NAMES.map((name) => (
              <div key={name} className="pb-1 text-center text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                {name.slice(0, 3)}
              </div>
            ))}

          {days.map((day) => {
            const dayEvents = eventsOn(day)
            const isToday = sameDay(day, today)
            const isOtherMonth = view === 'month' && day.getMonth() !== today.getMonth()

            return (
              <div
                key={day.toISOString()}
                className={cx(
                  'rounded-xl border p-2',
                  view === 'week' ? 'min-h-[150px]' : 'min-h-[92px]',
                  isToday ? 'border-eko-500/45 bg-eko-50' : 'border-line bg-card',
                  isOtherMonth && 'opacity-45',
                )}
              >
                <div className="mb-1.5 flex items-baseline gap-1.5">
                  {view === 'week' && (
                    <span className="text-[11px] font-medium tracking-wide text-ink-400 uppercase">
                      {DAY_NAMES[(day.getDay() + 6) % 7].slice(0, 3)}
                    </span>
                  )}
                  <span className={cx('text-[13px] font-semibold tabular-nums', isToday ? 'text-eko-700' : 'text-ink-900')}>
                    {day.getDate()}
                  </span>
                </div>

                <ul className="space-y-1">
                  {dayEvents.map((event) => (
                    <li
                      key={event.id}
                      className={cx(
                        'rounded-lg px-1.5 py-1 text-[11px] leading-tight',
                        event.fromGoogle ? 'bg-ground text-ink-700' : 'bg-eko-100 text-eko-700',
                      )}
                    >
                      <span className="block font-medium tabular-nums">{formatTime(event.start)}</span>
                      <span className="block truncate">{event.title}</span>
                    </li>
                  ))}

                  {dayEvents.length === 0 && !googleConnected && view === 'week' && (
                    <li className="text-[11px] text-ink-400">—</li>
                  )}
                </ul>
              </div>
            )
          })}
        </section>

        {googleConnected && (
          <p className="text-center text-[12px] text-ink-400">
            Les événements gris viennent de Google Calendar, les violets ont été créés depuis vos messages.
          </p>
        )}
      </div>
    </ScreenFrame>
  )
}
