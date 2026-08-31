import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { runSearch } from '../../lib/naturalSearch'
import { formatListTimestamp } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { RichText } from './RichText'

interface ChatSearchAnswerProps {
  question: string
  onOpen: (conversationId: string, messageId?: string) => void
}

/** Ce qu'Eko répond quand la question n'appelle ni dossier ni action. */
export function ChatSearchAnswer({ question, onOpen }: ChatSearchAnswerProps) {
  const { conversations, contacts } = useEko()
  const outcome = useMemo(() => runSearch(question, conversations, contacts), [question, conversations, contacts])

  if (outcome.kind === 'empty') {
    return (
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="text-[13.5px] leading-relaxed text-ink-900">
          Je ne trouve rien qui corresponde à cette demande.
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
          Dites-moi de qui il s'agit, de quoi ça parlait, ou sur quelle plateforme ça se passait. Vous pouvez aussi
          me demander le point sur un dossier : « où en est le projet Vertex ? ».
        </p>
      </div>
    )
  }

  return (
    <div className="surface-eko rounded-2xl border p-5">
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-eko-600" aria-hidden />
        <span className="text-[13px] font-semibold text-eko-700">
          {outcome.interpretation ?? 'Ce que j’ai trouvé'}
        </span>
        <EkoTag className="ml-auto">Eko</EkoTag>
      </div>

      {outcome.answer && (
        <p className="mb-3 text-[13.5px] leading-[1.7] text-ink-800">
          <RichText text={outcome.answer} />
        </p>
      )}

      <ul className="space-y-1.5">
        {outcome.results.map(({ conversation, message }) => (
          <li key={`${conversation.id}-${message?.id ?? 'aucun'}`}>
            <button
              type="button"
              onClick={() => onOpen(conversation.id, message?.id)}
              className="flex w-full items-start gap-2.5 rounded-xl bg-card px-3 py-2.5 text-left transition hover:shadow-sm"
            >
              <PlatformLogo platform={conversation.platform} size={16} className="mt-0.5 shrink-0" />

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate text-[12.5px] font-medium text-ink-900">{conversation.title}</span>
                  {message && (
                    <span className="ml-auto shrink-0 text-[11px] text-ink-400">
                      {formatListTimestamp(message.sentAt)}
                    </span>
                  )}
                </span>
                <span className="line-clamp-2 block text-[12px] text-ink-500">
                  {message?.text ?? conversation.ekoDigest}
                </span>
              </span>

              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-200" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
