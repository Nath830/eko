import { Star } from 'lucide-react'
import { useState } from 'react'
import { getPlatform } from '../../config/platforms'
import { conversationPhotos } from '../../lib/conversations'
import { ConversationRow } from '../inbox/ConversationRow'
import { Avatar } from '../ui/Avatar'
import { useEko } from '../../store/EkoStore'
import { PanelConversation } from './PanelConversation'
import { SidePanel } from './SidePanel'

/** Les conversations épinglées, vues depuis l'accueil. */
export function PriorityPanel({ onClose }: { onClose: () => void }) {
  const { priorityConversations, contacts, getConversation } = useEko()
  const [openId, setOpenId] = useState<string | null>(null)

  const open = getConversation(openId ?? undefined)

  if (open) {
    return (
      <SidePanel
        icon={<Avatar title={open.title} size={36} {...conversationPhotos(open, contacts)} />}
        title={open.title}
        subtitle={`${getPlatform(open.platform).name} · ${open.messages.length} messages`}
        goTo={`/reception/${open.id}`}
        goLabel="Ouvrir dans la réception"
        onBack={() => setOpenId(null)}
        flush
        onClose={onClose}
      >
        <PanelConversation conversation={open} />
      </SidePanel>
    )
  }

  return (
    <SidePanel
      icon={
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warn/15 text-warn">
          <Star className="h-[18px] w-[18px] fill-current" aria-hidden />
        </span>
      }
      title="Priorités"
      subtitle={`${priorityConversations.length} conversation${priorityConversations.length > 1 ? 's' : ''} épinglée${priorityConversations.length > 1 ? 's' : ''}`}
      goTo="/priorites"
      onClose={onClose}
    >
      {priorityConversations.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] leading-relaxed text-ink-500">
          Cliquez sur l'étoile d'une conversation pour la faire remonter ici.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {priorityConversations.map((conversation) => (
            <li key={conversation.id}>
              <ConversationRow conversation={conversation} isActive={false} onOpen={setOpenId} />
            </li>
          ))}
        </ul>
      )}
    </SidePanel>
  )
}
