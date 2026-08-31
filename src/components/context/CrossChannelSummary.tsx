import { Sparkles } from 'lucide-react'
import { getCrossChannelSummary } from '../../data/summaries'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import type { CrossChannelSummary as CrossSummary } from '../../types'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { SkeletonLines } from '../ui/Skeleton'

/* Résumé transversal : « où on en est avec Julien ? »
   Il mêle les canaux et indique la source de chaque élément. */
export function CrossChannelSummary({ contactId, contactName }: { contactId: string; contactName: string }) {
  const summary = getCrossChannelSummary(contactId)
  const { status, result, revealed, run } = useEkoGeneration<CrossSummary>()

  if (!summary) return null

  const steps = summary.items.length + 1

  if (status === 'idle') {
    return (
      <button
        type="button"
        onClick={() => void run(summary, steps, 160)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-eko-500/35 bg-eko-50 px-3 py-2 text-[13px] font-medium text-eko-700 transition hover:bg-eko-100"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Où en est-on avec {contactName.split(' ')[0]} ?
      </button>
    )
  }

  return (
    <div className="surface-eko rounded-2xl border p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[12px] font-semibold text-eko-700">{summary.question}</span>
        <EkoTag className="ml-auto">Tous canaux</EkoTag>
      </div>

      {status === 'thinking' ? (
        <div className="space-y-3">
          <SkeletonLines lines={2} />
          <SkeletonLines lines={4} />
        </div>
      ) : (
        <>
          <p className="mb-3 text-[12.5px] leading-relaxed text-ink-700">{result?.intro}</p>

          <ol className="space-y-2">
            {summary.items.slice(0, Math.max(0, revealed)).map((item) => (
              <li key={item.text} className="flex gap-2.5">
                <PlatformLogo platform={item.platform} size={15} className="mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] text-ink-400">{item.date}</span>
                  <span className="block text-[12.5px] leading-relaxed text-ink-700">{item.text}</span>
                </span>
              </li>
            ))}
          </ol>

          {revealed > summary.items.length && (
            <p className="mt-3 border-t border-eko-100 pt-2.5 text-[12.5px] leading-relaxed font-medium text-ink-900">
              {result?.conclusion}
            </p>
          )}
        </>
      )}
    </div>
  )
}
