import { getPlatform } from '../../config/platforms'
import { conversationPhotos } from '../../lib/conversations'
import { useEko } from '../../store/EkoStore'
import { Avatar } from '../ui/Avatar'
import { PanelConversation } from './PanelConversation'
import { SidePanel } from './SidePanel'

interface ConversationPanelProps {
  conversationId: string
  messageId?: string
  onClose: () => void
}

/** Une conversation ouverte seule dans le panneau de droite, par exemple
    depuis une réponse de l'assistant. */
export function ConversationPanel({ conversationId, messageId, onClose }: ConversationPanelProps) {
  const { getConversation } = useEko()
  const { contacts } = useEko()
  const conversation = getConversation(conversationId)

  if (!conversation) return null

  return (
    <SidePanel
      icon={<Avatar title={conversation.title} size={36} {...conversationPhotos(conversation, contacts)} />}
      title={conversation.title}
      subtitle={`${getPlatform(conversation.platform).name} · ${conversation.messages.length} messages`}
      goTo={`/reception/${conversation.id}`}
      goLabel="Ouvrir dans la réception"
      flush
      onClose={onClose}
    >
      <PanelConversation conversation={conversation} highlightMessageId={messageId} />
    </SidePanel>
  )
}
