import { useState } from 'react'
import { getPlatform, type PlatformId } from '../../config/platforms'
import { conversationPhotos, totalUnread } from '../../lib/conversations'
import { useEko } from '../../store/EkoStore'
import { ConversationRow } from '../inbox/ConversationRow'
import { Avatar } from '../ui/Avatar'
import { PlatformLogo } from '../ui/PlatformLogo'
import { PanelConversation } from './PanelConversation'
import { PlatformSwitcher } from './PlatformSwitcher'
import { SidePanel } from './SidePanel'

interface PlatformPanelProps {
  platform: PlatformId
  /** Passer à une autre application sans refermer le panneau */
  onSwitch: (platform: PlatformId) => void
  onClose: () => void
}

/** Les conversations d'une seule plateforme, sans quitter l'accueil. */
export function PlatformPanel({ platform, onSwitch, onClose }: PlatformPanelProps) {
  const { conversations, contacts, setFilter, getConversation } = useEko()
  const [openId, setOpenId] = useState<string | null>(null)
  const meta = getPlatform(platform)

  const open = getConversation(openId ?? undefined)

  const theirs = conversations.filter((conversation) => conversation.platform === platform)
  const unread = totalUnread(theirs)

  if (open) {
    return (
      <SidePanel
        icon={<Avatar title={open.title} size={36} {...conversationPhotos(open, contacts)} />}
        title={open.title}
        subtitle={`${meta.name} · ${open.messages.length} messages`}
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
      icon={<PlatformLogo platform={platform} size={26} />}
      title={meta.name}
      subtitle={`${theirs.length} conversation${theirs.length > 1 ? 's' : ''}${unread > 0 ? ` · ${unread} non lus` : ''}`}
      tabs={<PlatformSwitcher current={platform} onPick={onSwitch} />}
      goTo="/reception"
      onClose={() => {
        // Le filtre suit : « Aller voir » ouvre la réception sur cette plateforme.
        setFilter('platform', platform)
        onClose()
      }}
    >
      {theirs.length === 0 ? (
        <p className="px-4 py-10 text-center text-[13px] text-ink-500">
          Aucune conversation sur {meta.name} pour le moment.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {theirs.map((conversation) => (
            <li key={conversation.id}>
              <ConversationRow conversation={conversation} isActive={false} onOpen={setOpenId} />
            </li>
          ))}
        </ul>
      )}
    </SidePanel>
  )
}
