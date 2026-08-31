import { Star } from 'lucide-react'
import { ScreenFrame } from '../components/layout/ScreenFrame'
import { ConversationRow } from '../components/inbox/ConversationRow'
import { useEko } from '../store/EkoStore'

/** Les conversations que vous avez mises en priorité. */
export function PriorityScreen() {
  const { priorityConversations } = useEko()

  return (
    <ScreenFrame
      title="Priorités"
      subtitle={
        priorityConversations.length > 0
          ? `${priorityConversations.length} conversation${priorityConversations.length > 1 ? 's' : ''} épinglée${priorityConversations.length > 1 ? 's' : ''}`
          : 'Rien en priorité pour le moment'
      }
      width="narrow"
    >
      {priorityConversations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-ground/60 px-6 py-14 text-center">
          <Star className="mx-auto mb-3 h-6 w-6 text-ink-200" aria-hidden />
          <p className="text-[14px] font-medium text-ink-900">Aucune priorité</p>
          <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-ink-500">
            Cliquez sur l'étoile d'une conversation, dans la réception, pour la faire remonter ici.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {priorityConversations.map((conversation) => (
            <li key={conversation.id}>
              <ConversationRow conversation={conversation} isActive={false} />
            </li>
          ))}
        </ul>
      )}
    </ScreenFrame>
  )
}
