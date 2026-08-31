import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface PopoverProps {
  /** Contenu du bouton qui ouvre le menu */
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  triggerClassName?: string
}

/** Petit menu déroulant, refermé au clic extérieur ou à la touche Échap. */
export function Popover({ trigger, children, align = 'left', triggerClassName }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={container} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className={triggerClassName}>
        {trigger}
      </button>

      {open && (
        <div
          className={cx(
            'card absolute top-[calc(100%+6px)] z-30 min-w-[220px] rounded-2xl p-2',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
