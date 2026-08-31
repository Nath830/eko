import { ArrowUp, X } from 'lucide-react'
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import { EkoWordmark } from '../ui/EkoMark'

interface ChatComposerProps {
  onAsk: (question: string) => void
  placeholder?: string
  /** Raccourcis affichés sous le champ quand il est vide */
  shortcuts?: { label: string; ask: string }[]
  autoFocus?: boolean
  /** Le sujet dont on parle, épinglé au-dessus du champ */
  context?: { label: string; icon?: React.ReactNode }
  onClearContext?: () => void
}

/** Le champ où l'on parle à Eko. */
export function ChatComposer({
  onAsk,
  placeholder,
  shortcuts,
  autoFocus,
  context,
  onClearContext,
}: ChatComposerProps) {
  const [value, setValue] = useState('')

  function submit(event?: FormEvent) {
    event?.preventDefault()
    if (!value.trim()) return

    onAsk(value)
    setValue('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="card rounded-3xl px-4 pt-3 pb-2.5">
        {/* La conversation dont on parle, épinglée au-dessus du champ */}
        {context && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-eko-50 px-2.5 py-1.5">
            <span className="text-[11px] font-semibold tracking-wider text-eko-700 uppercase">À propos de</span>
            {context.icon}
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink-900">{context.label}</span>

            {onClearContext && (
              <button
                type="button"
                onClick={onClearContext}
                aria-label="Parler d'autre chose"
                className="rounded-md p-0.5 text-ink-400 transition hover:bg-card hover:text-ink-900"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <EkoWordmark height={14} className="mt-1.5 shrink-0 text-ink-900" />

          <textarea
            value={value}
            rows={2}
            autoFocus={autoFocus}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? 'Demandez à Eko…'}
            aria-label="Demander à Eko"
            className="scrollbar-slim max-h-32 min-h-[46px] w-full resize-none bg-transparent text-[14.5px] leading-relaxed text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="min-w-0 flex-1 truncate text-[11px] text-ink-400">
            Un dossier, un récap, un rendez-vous, une alerte — ou un document à transmettre
          </span>

          <button
            type="submit"
            aria-label="Envoyer la question"
            className={cx(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
              value.trim() ? 'bg-ink-900 text-white hover:opacity-90' : 'bg-ground text-ink-200',
            )}
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {shortcuts && shortcuts.length > 0 && !value && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.label}
              type="button"
              title={shortcut.ask}
              onClick={() => onAsk(shortcut.ask)}
              className="rounded-full border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:bg-eko-50 hover:text-eko-700"
            >
              {shortcut.label}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
