import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/* ============================================================================
   LA FENÊTRE DE CRÉATION D'ÉVÉNEMENT

   Un seul endroit décide de son ouverture : n'importe quel bouton « Ajouter à
   l'agenda » appelle openEventComposer(), et la fenêtre s'affiche au centre.
============================================================================ */

export interface EventDraft {
  title: string
  start: string
  end: string
  contactId?: string
  conversationId?: string
  /** Signature du créneau repéré, pour retenir la décision */
  signature?: string
  /** Adresses des personnes conviées */
  guests: string[]
}

interface EventComposerValue {
  draft: EventDraft | null
  openEventComposer: (draft: EventDraft) => void
  closeEventComposer: () => void
}

const EventComposerContext = createContext<EventComposerValue | null>(null)

export function EventComposerProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<EventDraft | null>(null)

  const openEventComposer = useCallback((next: EventDraft) => setDraft(next), [])
  const closeEventComposer = useCallback(() => setDraft(null), [])

  return (
    <EventComposerContext.Provider value={{ draft, openEventComposer, closeEventComposer }}>
      {children}
    </EventComposerContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEventComposer(): EventComposerValue {
  const value = useContext(EventComposerContext)
  if (!value) throw new Error('useEventComposer doit être utilisé à l’intérieur de <EventComposerProvider>')
  return value
}
