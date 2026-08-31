import { Inbox, Mic, Paperclip } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getPlatform, type PlatformId } from '../../config/platforms'
import { conversationPhotos, messageDigest } from '../../lib/conversations'
import { formatDaySeparator, formatTime, isSameDay } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import type { Conversation, Message } from '../../types'
import { Avatar } from '../ui/Avatar'
import { PlatformLogo } from '../ui/PlatformLogo'
import { PanelConversation } from './PanelConversation'
import { PlatformSwitcher } from './PlatformSwitcher'
import { SidePanel } from './SidePanel'

interface InboxPreviewPanelProps {
  /** Ouvrir une application depuis la rangée de logos */
  onPickPlatform: (platform: PlatformId) => void
  onClose: () => void
}

/* Aperçu de la réception depuis l'accueil.

   Au départ, tous les messages reçus, toutes plateformes confondues. Cliquer
   sur l'un d'eux ouvre la conversation ici même ; « Tout voir » ouvre
   l'application complète. */
export function InboxPreviewPanel({ onPickPlatform, onClose }: InboxPreviewPanelProps) {
  const { conversations, contacts, unreadTotal, getConversation } = useEko()
  const [openId, setOpenId] = useState<string | null>(null)

  const open = getConversation(openId ?? undefined)

  const received = useMemo(() => {
    const all: { message: Message; conversation: Conversation }[] = []

    for (const conversation of conversations) {
      for (const message of conversation.messages) {
        if (message.from === 'them') all.push({ message, conversation })
      }
    }

    return all
      .sort((a, b) => new Date(b.message.sentAt).getTime() - new Date(a.message.sentAt).getTime())
      .slice(0, 60)
  }, [conversations])

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
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-white">
          <Inbox className="h-[18px] w-[18px]" aria-hidden />
        </span>
      }
      title="Réception"
      subtitle={`${received.length} messages reçus${unreadTotal > 0 ? ` · ${unreadTotal} non lus` : ''}`}
      tabs={<PlatformSwitcher onPick={onPickPlatform} />}
      goTo="/reception"
      onClose={onClose}
    >
      <ul className="space-y-0.5">
        {received.map(({ message, conversation }, index) => {
          const previous = received[index - 1]
          const newDay = !previous || !isSameDay(previous.message.sentAt, message.sentAt)

          return (
            <li key={message.id}>
              {newDay && (
                <p className="px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
                  {formatDaySeparator(message.sentAt)}
                </p>
              )}

              <button
                type="button"
                onClick={() => setOpenId(conversation.id)}
                className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-hover"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: getPlatform(conversation.platform).softColor }}
                >
                  <PlatformLogo platform={conversation.platform} size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-[13px] font-medium text-ink-900">
                      {message.authorName ?? conversation.title}
                    </span>
                    {conversation.isGroup && (
                      <span className="truncate text-[11.5px] text-ink-400">{conversation.title}</span>
                    )}
                    <span className="ml-auto shrink-0 text-[11px] text-ink-400 tabular-nums">
                      {formatTime(message.sentAt)}
                    </span>
                  </span>

                  <span className="mt-0.5 flex items-start gap-1.5">
                    {message.voice && <Mic className="mt-[3px] h-3 w-3 shrink-0 text-ink-400" aria-hidden />}
                    {message.attachments?.length && !message.voice ? (
                      <Paperclip className="mt-[3px] h-3 w-3 shrink-0 text-ink-400" aria-hidden />
                    ) : null}
                    <span className="line-clamp-2 text-[12.5px] leading-snug text-ink-600">
                      {messageDigest(message)}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </SidePanel>
  )
}
