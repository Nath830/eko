import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface ScreenFrameProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  /** Largeur maximale du contenu */
  width?: 'wide' | 'narrow'
}

/** Cadre commun aux écrans autres que la réception. */
export function ScreenFrame({ title, subtitle, actions, children, width = 'wide' }: ScreenFrameProps) {
  return (
    <div className="h-full">
      <div className="card flex h-full min-h-0 flex-col overflow-hidden">
        <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line-soft px-5 py-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-semibold tracking-tight text-ink-900">{title}</h1>
            {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-500">{subtitle}</p>}
          </div>
          {actions}
        </header>

        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
          <div className={cx('mx-auto px-5 py-5', width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl')}>{children}</div>
        </div>
      </div>
    </div>
  )
}
