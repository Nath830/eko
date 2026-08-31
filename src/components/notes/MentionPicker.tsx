import { AtSign, Folder, MessageSquare, Tag, User } from 'lucide-react'
import { getPlatform } from '../../config/platforms'
import { topics } from '../../data/topics'
import { useEko } from '../../store/EkoStore'
import type { Mention, MentionKind } from '../../types'
import { Popover } from '../ui/Popover'

const ICONS: Record<MentionKind, typeof User> = {
  contact: User,
  conversation: MessageSquare,
  topic: Folder,
  label: Tag,
}

/* Citer quelque chose dans une note.

   Une note qui cite une personne, une conversation, un sujet ou une étiquette
   entre dans le dossier correspondant : Eko en tient compte quand il fait le
   point sur la situation. */
export function MentionPicker({ onPick }: { onPick: (mention: Mention) => void }) {
  const { contacts, conversations, labels } = useEko()

  const groups: { title: string; items: Mention[] }[] = [
    {
      title: 'Personnes',
      items: contacts.map((contact) => ({ kind: 'contact', id: contact.id, label: contact.fullName })),
    },
    {
      title: 'Sujets',
      items: topics.map((topic) => ({ kind: 'topic', id: topic.id, label: topic.name })),
    },
    {
      title: 'Conversations',
      items: conversations.slice(0, 10).map((conversation) => ({
        kind: 'conversation',
        id: conversation.id,
        label: `${conversation.title} · ${getPlatform(conversation.platform).name}`,
      })),
    },
    {
      title: 'Étiquettes',
      items: labels.map((label) => ({ kind: 'label', id: label.id, label: label.name })),
    },
  ]

  return (
    <Popover
      align="left"
      triggerClassName="flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:text-eko-700"
      trigger={
        <>
          <AtSign className="h-3.5 w-3.5" aria-hidden />
          Citer
        </>
      }
    >
      {(close) => (
        <div className="scrollbar-slim max-h-[340px] w-[290px] space-y-2 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-2 pb-1 text-[10.5px] font-semibold tracking-wider text-ink-400 uppercase">
                {group.title}
              </p>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICONS[item.kind]

                  return (
                    <button
                      key={`${item.kind}-${item.id}`}
                      type="button"
                      onClick={() => {
                        onPick(item)
                        close()
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] text-ink-900 transition hover:bg-hover"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Popover>
  )
}
