import { useEffect } from 'react'
import { ConversationPane } from '../conversation/ConversationPane'
import { useEko } from '../../store/EkoStore'
import type { Conversation } from '../../types'

interface PanelConversationProps {
  conversation: Conversation
  /** Message à mettre en évidence, quand on arrive depuis une recherche */
  highlightMessageId?: string
}

/** Une conversation ouverte à l'intérieur d'un panneau de l'accueil. */
export function PanelConversation({ conversation, highlightMessageId }: PanelConversationProps) {
  const { markAsRead } = useEko()

  // L'ouvrir la marque comme lue, comme dans la réception.
  useEffect(() => {
    markAsRead(conversation.id)
  }, [conversation.id, markAsRead])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ConversationPane conversation={conversation} highlightMessageId={highlightMessageId} embedded />
    </div>
  )
}
