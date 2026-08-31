import { Check, Info, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cx } from '../../lib/cx'
import { useToast } from '../../store/ToastContext'

const ICONS = { info: Info, success: Check, eko: Sparkles } as const

/** Pile de notifications, en bas à droite sur ordinateur, en haut sur mobile. */
export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:top-auto md:right-5 md:bottom-5 md:items-end">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.tone]

        return (
          <div
            key={toast.id}
            role="status"
            className={cx(
              'card pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-3.5 py-3',
              toast.tone === 'eko' && 'surface-eko border',
            )}
          >
            <span
              className={cx(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                toast.tone === 'eko' ? 'bg-eko-500 text-white' : 'bg-ground text-ink-500',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug text-ink-900">{toast.message}</p>

              {toast.to && (
                <Link
                  to={toast.to}
                  onClick={() => dismiss(toast.id)}
                  className="mt-1 inline-block text-[12.5px] font-medium text-eko-600 hover:text-eko-700"
                >
                  {toast.actionLabel ?? 'Ouvrir'}
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fermer la notification"
              className="rounded-full p-1 text-ink-400 transition hover:bg-hover hover:text-ink-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        )
      })}
    </div>
  )
}
