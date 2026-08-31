import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface SidePanelProps {
  icon: ReactNode
  title: string
  subtitle: string
  /** Rangée affichée sous le titre : les logos pour changer d'application */
  tabs?: ReactNode
  /** Où mène le bouton « Tout voir » */
  goTo: string
  /** Libellé du bouton, « Tout voir » par défaut */
  goLabel?: string
  /** Revenir à la liste, quand une conversation est ouverte dans le panneau */
  onBack?: () => void
  /** Laisser le contenu gérer sa propre mise en page, sans marge ni défilement */
  flush?: boolean
  onClose: () => void
  children: ReactNode
}

/* Le grand panneau qui s'ouvre à droite depuis la page d'accueil.

   On y jette un œil sans quitter l'accueil ; le bouton « Aller voir » ouvre
   l'application complète. */
export function SidePanel({
  icon,
  title,
  subtitle,
  tabs,
  goTo,
  goLabel = 'Tout voir',
  onBack,
  flush,
  onClose,
  children,
}: SidePanelProps) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="fixed inset-0 z-40 cursor-default bg-ink-900/10 backdrop-blur-[2px]"
      />

      <aside className="card fixed inset-y-4 right-4 z-50 flex w-[min(680px,calc(100vw-2rem))] flex-col overflow-hidden">
        <header className="shrink-0 border-b border-line-soft px-5 pt-4 pb-3.5">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Revenir à la liste"
                className="-ml-1.5 rounded-lg p-1.5 text-ink-500 transition hover:bg-hover hover:text-ink-900"
              >
                <ArrowLeft className="h-[18px] w-[18px]" aria-hidden />
              </button>
            )}

            {icon}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[16px] font-semibold text-ink-900">{title}</h2>
              <p className="truncate text-[12.5px] text-ink-500 tabular-nums">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le panneau"
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-hover hover:text-ink-900"
            >
              <X className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>

          {tabs && <div className="mt-3 border-t border-line-soft pt-2.5">{tabs}</div>}

          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(goTo)
            }}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-3 py-2.5 text-[13px] font-medium text-white transition hover:opacity-90"
          >
            {goLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </header>

        <div
          className={
            flush
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'scrollbar-slim min-h-0 flex-1 overflow-y-auto px-2.5 py-3'
          }
        >
          {children}
        </div>
      </aside>
    </>
  )
}
