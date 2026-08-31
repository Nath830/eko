import { ArrowRight, Clock, MailOpen, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import { cx } from '../../lib/cx'
import { formatListTimestamp } from '../../lib/date'
import { buildMissed, type MissedItem, type MissedReport } from '../../lib/missed'
import { lastMessage } from '../../lib/conversations'
import { useEko } from '../../store/EkoStore'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { SkeletonLines } from '../ui/Skeleton'

interface AssistantMissedProps {
  /** Ouvrir la conversation, sur place ou dans la réception */
  onOpen: (conversationId: string, messageId?: string) => void
}

/* « Qu'est-ce que j'ai raté ? »

   La liste vient de l'état réel — non-lus et messages restés sans réponse —
   et le classement met en tête ce qui coûte le plus cher à laisser traîner. */
export function AssistantMissed({ onOpen }: AssistantMissedProps) {
  const { conversations, isPriority } = useEko()
  const { status, revealed, run } = useEkoGeneration<MissedReport>()

  const report = buildMissed(conversations, isPriority)
  const total = report.important.length + report.others.length

  useEffect(() => {
    void run(report, total + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const importantShown = Math.max(0, Math.min(report.important.length, revealed - 1))
  const othersShown = Math.max(0, revealed - 1 - report.important.length)

  return (
    <div className="p-3.5">
      <div className="surface-eko rounded-2xl border p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles className={cx('h-4 w-4 text-eko-600', status === 'thinking' && 'animate-pulse')} aria-hidden />
          <span className="text-[13px] font-semibold text-eko-700">Ce que vous avez raté</span>
          <EkoTag className="ml-auto">Eko</EkoTag>
        </div>

        {status === 'thinking' ? (
          <div className="space-y-3">
            <SkeletonLines lines={2} />
            <SkeletonLines lines={4} />
          </div>
        ) : total === 0 ? (
          <p className="text-[13px] leading-relaxed text-ink-700">
            Rien ne vous a échappé : tout est lu et personne n'attend de réponse de votre part.
          </p>
        ) : (
          <>
            {revealed >= 1 && (
              <p className="mb-3 text-[13px] leading-relaxed text-ink-700">
                {report.unreadCount > 0 && (
                  <>
                    <strong className="font-semibold">{report.unreadCount}</strong> conversation
                    {report.unreadCount > 1 ? 's' : ''} non lue{report.unreadCount > 1 ? 's' : ''}
                  </>
                )}
                {report.unreadCount > 0 && report.awaitingCount > 0 && ', et '}
                {report.awaitingCount > 0 && (
                  <>
                    <strong className="font-semibold">{report.awaitingCount}</strong> qui attend
                    {report.awaitingCount > 1 ? 'ent' : ''} une réponse de vous
                  </>
                )}
                . Voici celles qui comptent vraiment.
              </p>
            )}

            {importantShown > 0 && (
              <div className="mb-3">
                <h4 className="mb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  Les plus importantes
                </h4>
                <ul className="space-y-1.5">
                  {report.important.slice(0, importantShown).map((item) => (
                    <MissedRow key={item.conversation.id} item={item} onOpen={onOpen} detailed />
                  ))}
                </ul>
              </div>
            )}

            {othersShown > 0 && report.others.length > 0 && (
              <div>
                <h4 className="mb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  Le reste
                </h4>
                <ul className="space-y-1">
                  {report.others.slice(0, othersShown).map((item) => (
                    <MissedRow key={item.conversation.id} item={item} onOpen={onOpen} />
                  ))}
                </ul>
              </div>
            )}

            {status === 'done' && (
              <p className="mt-3 border-t border-eko-100 pt-2.5 text-[12px] text-ink-500">
                Cliquez sur une conversation pour l'ouvrir et y répondre tout de suite.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MissedRow({
  item,
  onOpen,
  detailed,
}: {
  item: MissedItem
  onOpen: (conversationId: string, messageId?: string) => void
  detailed?: boolean
}) {
  const { conversation, reason, isUnread, isAwaiting } = item
  const last = lastMessage(conversation)

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(conversation.id, last?.id)}
        className="flex w-full items-start gap-2.5 rounded-xl bg-card px-3 py-2.5 text-left transition hover:shadow-sm"
      >
        <PlatformLogo platform={conversation.platform} size={17} className="mt-0.5 shrink-0" />

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-[12.5px] font-medium text-ink-900">{conversation.title}</span>
            <span className="ml-auto shrink-0 text-[11px] text-ink-400">
              {last ? formatListTimestamp(last.sentAt) : ''}
            </span>
          </span>

          {detailed && <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-600">{reason}</span>}

          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            {isAwaiting && (
              <span className="flex items-center gap-1 rounded-full bg-warn/12 px-1.5 py-0.5 text-[10.5px] font-medium text-warn">
                <Clock className="h-2.5 w-2.5" aria-hidden />
                Sans réponse
              </span>
            )}
            {isUnread && (
              <span className="flex items-center gap-1 rounded-full bg-eko-100 px-1.5 py-0.5 text-[10.5px] font-medium text-eko-700">
                <MailOpen className="h-2.5 w-2.5" aria-hidden />
                Non lu
              </span>
            )}
            {!detailed && (
              <span className="truncate text-[11.5px] text-ink-400">{conversation.ekoDigest}</span>
            )}
          </span>
        </span>

        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-200" aria-hidden />
      </button>
    </li>
  )
}
