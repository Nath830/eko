import { CalendarDays, Inbox, Settings, Star, StickyNote, Users } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

/* ============================================================================
   RAIL DE NAVIGATION

   👉 POUR AJOUTER UN ESPACE : ajouter une entrée ici, puis la route
      correspondante dans src/App.tsx.

   Les alertes et le debrief n'ont pas d'espace à eux : ils se demandent
   directement à l'assistant Eko, dans la barre du haut.
============================================================================ */

export interface NavEntry {
  id: string
  label: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Où placer l'entrée : en haut du rail, ou détachée en bas */
  position: 'main' | 'bottom'
}

export const NAV_ENTRIES: NavEntry[] = [
  { id: 'reception', label: 'Réception', path: '/reception', icon: Inbox, position: 'main' },
  { id: 'priorites', label: 'Priorités', path: '/priorites', icon: Star, position: 'main' },
  { id: 'calendrier', label: 'Calendrier', path: '/calendrier', icon: CalendarDays, position: 'main' },
  { id: 'contacts', label: 'Contacts', path: '/contacts', icon: Users, position: 'main' },
  { id: 'notes', label: 'Notes', path: '/notes', icon: StickyNote, position: 'main' },
  { id: 'reglages', label: 'Réglages', path: '/reglages', icon: Settings, position: 'bottom' },
]
