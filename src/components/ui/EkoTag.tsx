import { Sparkles } from 'lucide-react'
import { cx } from '../../lib/cx'

interface EkoTagProps {
  /** Ce qu'Eko a produit : « Résumé », « Brouillon », « Rapprochement »… */
  children?: React.ReactNode
  className?: string
}

/** Marqueur systématique de tout contenu généré par Eko.
    L'utilisateur doit toujours pouvoir distinguer l'IA de l'humain. */
export function EkoTag({ children = 'Généré par Eko', className }: EkoTagProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border border-eko-100 bg-eko-50 px-2 py-0.5',
        'text-[10.5px] font-medium tracking-wide text-eko-600 uppercase',
        className,
      )}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      {children}
    </span>
  )
}
