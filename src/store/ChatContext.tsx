import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { detectCommand, type AssistantCommand } from '../lib/assistantCommands'
import { contacts } from '../data/contacts'
import { conversations } from '../data/conversations'

/* ============================================================================
   LA CONVERSATION AVEC EKO

   Chaque question posée devient un tour : la question telle qu'elle a été
   écrite, et ce qu'Eko en a compris. L'historique reste en mémoire pour la
   durée de la démonstration.
============================================================================ */

export interface ChatTurn {
  id: string
  question: string
  askedAt: string
  /** Ce qu'Eko a reconnu ; null quand il ne sait pas répondre */
  command: AssistantCommand | null
  /** La conversation dont on parlait au moment de la question */
  contextConversationId?: string
}

interface ChatValue {
  turns: ChatTurn[]
  /** Poser une question : ouvre le chat si ce n'est pas déjà fait */
  ask: (question: string) => void
  /** Revenir à l'accueil sans perdre la conversation */
  hidden: boolean
  hide: () => void
  show: () => void
  /** Repartir d'une page blanche */
  clear: () => void
  /** Le tour vers lequel on veut faire défiler, choisi depuis l'historique */
  focusedTurnId: string | null
  focusTurn: (id: string | null) => void
  /** La conversation qu'Eko prend comme sujet par défaut */
  contextConversationId: string | null
  setContext: (conversationId: string | null) => void
}

const ChatContext = createContext<ChatValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [focusedTurnId, setFocusedTurnId] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [contextConversationId, setContext] = useState<string | null>(null)

  const ask = useCallback(
    (question: string) => {
      const text = question.trim()
      if (!text) return

      // Si l'on parle depuis une conversation, Eko sait de quel dossier il
      // s'agit : « résume » suffit alors, sans nommer le sujet.
      const context = conversations.find((item) => item.id === contextConversationId)

      const turn: ChatTurn = {
        id: `tour-${Date.now()}`,
        question: text,
        askedAt: new Date().toISOString(),
        command: detectCommand(text, contacts, context?.topicId),
        contextConversationId: contextConversationId ?? undefined,
      }

      setTurns((current) => [...current, turn])
      setFocusedTurnId(turn.id)
      setHidden(false)
    },
    [contextConversationId],
  )

  const clear = useCallback(() => {
    setTurns([])
    setFocusedTurnId(null)
    setHidden(false)
  }, [])

  const hide = useCallback(() => setHidden(true), [])
  const show = useCallback(() => setHidden(false), [])

  return (
    <ChatContext.Provider
      value={{
        turns,
        ask,
        hidden,
        hide,
        show,
        clear,
        focusedTurnId,
        focusTurn: setFocusedTurnId,
        contextConversationId,
        setContext,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat(): ChatValue {
  const value = useContext(ChatContext)
  if (!value) throw new Error('useChat doit être utilisé à l’intérieur de <ChatProvider>')
  return value
}
