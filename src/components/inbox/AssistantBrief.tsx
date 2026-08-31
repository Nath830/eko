import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { briefs, type Brief, type BriefKind } from '../../data/briefs'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import { useEko } from '../../store/EkoStore'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { SkeletonLines } from '../ui/Skeleton'

interface AssistantBriefProps {
  kind: BriefKind
  /** Ouvrir la conversation, sur place ou dans la réception */
  onOpen: (conversationId: string) => void
}

/* Le récapitulatif demandé à Eko : « fais-moi un récap », « mes priorités pour
   le reste de la journée ». Chaque ligne ouvre sa conversation. */
export function AssistantBrief({ kind, onOpen }: AssistantBriefProps) {
  const { getConversation } = useEko()
  const { status, result, revealed, run } = useEkoGeneration<Brief>()

  const brief = briefs[kind]
  const steps = brief.items.length + 1

  useEffect(() => {
    void run(brief, steps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  const itemsShown = Math.max(0, Math.min(brief.items.length, revealed - 1))

  return (
    <div className="p-3.5">
      <div className="surface-eko rounded-2xl border p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles
            className={`h-4 w-4 text-eko-600 ${status === 'thinking' ? 'animate-pulse' : ''}`}
            aria-hidden
          />
          <span className="text-[13px] font-semibold text-eko-700">{brief.heading}</span>
          <EkoTag className="ml-auto">Eko</EkoTag>
        </div>

        {status === 'thinking' || !result ? (
          <div className="space-y-3">
            <SkeletonLines lines={2} />
            <SkeletonLines lines={4} />
          </div>
        ) : (
          <>
            {revealed >= 1 && (
              <p className="mb-3 text-[13px] leading-relaxed text-ink-700">{result.intro}</p>
            )}

            <ul className="space-y-1.5">
              {brief.items.slice(0, itemsShown).map((item) => {
                const conversation = getConversation(item.conversationId)

                return (
                  <li key={item.conversationId + item.title}>
                    <button
                      type="button"
                      onClick={() => onOpen(item.conversationId)}
                      className="flex w-full items-start gap-2.5 rounded-xl bg-card px-3 py-2.5 text-left transition hover:shadow-sm"
                    >
                      {conversation && (
                        <PlatformLogo platform={conversation.platform} size={17} className="mt-0.5 shrink-0" />
                      )}

                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate text-[12.5px] font-medium text-ink-900">{item.title}</span>
                          {item.note && (
                            <span className="ml-auto shrink-0 text-[11px] text-ink-400">{item.note}</span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-500">{item.detail}</span>
                      </span>

                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-200" aria-hidden />
                    </button>
                  </li>
                )
              })}
            </ul>

            {status === 'done' && brief.closing && (
              <p className="mt-3 border-t border-eko-100 pt-2.5 text-[12.5px] font-medium text-ink-800">
                {brief.closing}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
