import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { EkoChatPanel } from '../chat/EkoChatPanel'
import { EkoOrb } from '../chat/EkoOrb'
import { cx } from '../../lib/cx'
import { NavRail } from './NavRail'

/* Structure générale d'Eko.

   Le rail à gauche, l'écran actif au centre, et l'assistant qui vient se
   ranger à côté quand on ouvre la bille — jamais par-dessus : l'écran en
   cours se resserre pour lui faire de la place. */
export function AppShell() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="flex h-full flex-col-reverse gap-3 bg-ground p-3 pt-safe text-ink-900 md:flex-row md:gap-4 md:p-4">
      <NavRail />

      <div className={cx('relative min-h-0 min-w-0 flex-1', chatOpen && 'hidden md:block')}>
        <Outlet />
        <EkoOrb open={chatOpen} onClick={() => setChatOpen((open) => !open)} />
      </div>

      {chatOpen && <EkoChatPanel onClose={() => setChatOpen(false)} />}
    </div>
  )
}
