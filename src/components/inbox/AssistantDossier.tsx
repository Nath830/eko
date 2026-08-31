import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import type { PlatformId } from '../../config/platforms'
import { dossiers, type Dossier } from '../../data/dossiers'
import { RichText } from '../chat/RichText'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import { conversationsOfTopic } from '../../lib/topics'
import { MentionChip } from '../notes/MentionChip'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { Skeleton, SkeletonLines } from '../ui/Skeleton'

interface AssistantDossierProps {
  dossierId: string
  onOpen: (conversationId: string, messageId?: string) => void
  onOpenContact?: (contactId: string) => void
  onOpenPlatform?: (platform: PlatformId) => void
  /** Version pleine page, dans le chat */
  wide?: boolean
}

/* La réponse longue d'Eko sur un sujet.

   Elle se lit d'une traite : une introduction, des sections titrées, et une
   conclusion qui dit quoi faire. Les éléments cités renvoient à la
   conversation d'où ils viennent, sur n'importe quelle plateforme. */
export function AssistantDossier({
  dossierId,
  onOpen,
  onOpenContact,
  onOpenPlatform,
  wide,
}: AssistantDossierProps) {
  const { conversations, notes } = useEko()
  const { status, result, revealed, run } = useEkoGeneration<Dossier>()

  const dossier = findDossierById(dossierId)

  // Les blocs apparaissent un à un : l'introduction, chaque section, la fin.
  const steps = dossier ? dossier.sections.length + 2 : 0

  useEffect(() => {
    if (dossier) void run(dossier, steps, 260)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossierId])

  if (!dossier) return null

  const related = conversationsOfTopic(conversations, dossier.topicId)
  const relatedIds = new Set(related.map((conversation) => conversation.id))
  const contactIds = new Set(
    related.flatMap((conversation) => [conversation.contactId, ...(conversation.participantIds ?? [])]),
  )

  // Vos notes entrent dans le dossier dès qu'elles citent le sujet, une
  // personne ou une conversation qui en fait partie.
  const linkedNotes = notes.filter(
    (note) =>
      note.author === 'me' &&
      ((note.mentions ?? []).some(
        (mention) =>
          (mention.kind === 'topic' && mention.id === dossier.topicId) ||
          (mention.kind === 'contact' && contactIds.has(mention.id)) ||
          (mention.kind === 'conversation' && relatedIds.has(mention.id)),
      ) ||
        (note.conversationId !== undefined && relatedIds.has(note.conversationId))),
  )
  const sectionsShown = Math.max(0, Math.min(dossier.sections.length, revealed - 1))

  return (
    <div className={cx(wide ? '' : 'p-3.5')}>
      <div className={cx('surface-eko rounded-2xl border', wide ? 'p-6' : 'p-5')}>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className={cx('h-4 w-4 text-eko-600', status === 'thinking' && 'animate-pulse')} aria-hidden />
          <h3 className={cx('font-semibold text-ink-900', wide ? 'text-[19px]' : 'text-[15px]')}>{dossier.title}</h3>
          <EkoTag className="ml-auto shrink-0">Eko</EkoTag>
        </div>

        {status === 'thinking' ? (
          <div className="space-y-4">
            <SkeletonLines lines={3} />
            <Skeleton className="h-2.5 w-1/3" />
            <SkeletonLines lines={4} />
            <Skeleton className="h-2.5 w-1/4" />
            <SkeletonLines lines={3} />
          </div>
        ) : (
          <div className="space-y-5">
            {revealed >= 1 && (
              <p className={cx('leading-[1.75] text-ink-800', wide ? 'text-[15px]' : 'text-[13.5px]')}>
                <RichText text={result?.opening ?? ''} onOpenContact={onOpenContact} onOpenPlatform={onOpenPlatform} />
              </p>
            )}

            {dossier.sections.slice(0, sectionsShown).map((section) => (
              <section key={section.heading}>
                <h4
                  className={cx(
                    'mb-2 font-semibold tracking-wider text-ink-400 uppercase',
                    wide ? 'text-[11.5px]' : 'text-[11px]',
                  )}
                >
                  {section.heading}
                </h4>

                <div className="space-y-2.5">
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className={cx('leading-[1.75] text-ink-700', wide ? 'text-[14.5px]' : 'text-[13.5px]')}
                    >
                      <RichText text={paragraph} onOpenContact={onOpenContact} onOpenPlatform={onOpenPlatform} />
                    </p>
                  ))}
                </div>

                {section.points && section.points.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {section.points.map((point) => (
                      <li key={point.text}>
                        <button
                          type="button"
                          onClick={() => point.conversationId && onOpen(point.conversationId)}
                          disabled={!point.conversationId}
                          className="flex w-full items-start gap-2.5 rounded-xl bg-card px-3 py-2 text-left transition enabled:hover:shadow-sm"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-ground text-[9.5px] font-semibold text-ink-500 tabular-nums">
                            {referenceNumber(dossier, point)}
                          </span>

                          {point.platform && (
                            <PlatformLogo platform={point.platform} size={15} className="mt-0.5 shrink-0" />
                          )}

                          <span className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-700">
                            {point.text}
                            {point.when && <span className="text-ink-400"> · {point.when}</span>}
                          </span>

                          {point.conversationId && (
                            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-200" aria-hidden />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {revealed > dossier.sections.length + 1 && (
              <p
                className={cx(
                  'border-t border-eko-100 pt-4 leading-[1.75] font-medium text-ink-900',
                  wide ? 'text-[14.5px]' : 'text-[13.5px]',
                )}
              >
                <RichText text={result?.closing ?? ''} onOpenContact={onOpenContact} onOpenPlatform={onOpenPlatform} />
              </p>
            )}

            {status === 'done' && linkedNotes.length > 0 && (
              <div className="border-t border-eko-100 pt-3.5">
                <p className="mb-2 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  Ce que vous aviez noté
                </p>

                <ul className="space-y-1.5">
                  {linkedNotes.map((note) => (
                    <li key={note.id} className="rounded-xl bg-card p-3">
                      <p className="text-[12.5px] font-medium text-ink-900">{note.title ?? 'Note'}</p>
                      <p className="mt-0.5 line-clamp-3 text-[12.5px] leading-relaxed whitespace-pre-line text-ink-600">
                        {note.body}
                      </p>

                      {note.mentions && note.mentions.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {note.mentions.map((mention) => (
                            <MentionChip key={`${mention.kind}-${mention.id}`} mention={mention} />
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {status === 'done' && related.length > 0 && (
              <div className="border-t border-eko-100 pt-3">
                <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  Les {related.length} conversations du dossier
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {related.map((conversation) => (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => onOpen(conversation.id)}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 text-[12px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:text-eko-700"
                    >
                      <PlatformLogo platform={conversation.platform} size={13} />
                      {conversation.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function findDossierById(id: string): Dossier | undefined {
  return dossiers.find((dossier) => dossier.id === id)
}

/** Numéro de la référence dans l'ensemble du dossier. */
function referenceNumber(dossier: Dossier, point: { text: string }): number {
  const all = dossier.sections.flatMap((section) => section.points ?? [])
  return all.findIndex((item) => item.text === point.text) + 1
}
