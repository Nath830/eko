import { ArrowLeft, Check, Tag, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPlatform } from '../../config/platforms'
import { conversationPhotos } from '../../lib/conversations'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import type { Conversation } from '../../types'
import { Avatar } from '../ui/Avatar'
import { LabelChip } from '../ui/LabelChip'
import { PlatformLogo } from '../ui/PlatformLogo'
import { Popover } from '../ui/Popover'

interface ConversationHeaderProps {
  conversation: Conversation
  /** Dans un panneau : retour et fermeture sont déjà fournis par le panneau */
  embedded?: boolean
}

export function ConversationHeader({ conversation, embedded }: ConversationHeaderProps) {
  const { labels, contacts, toggleLabelOnConversation } = useEko()
  const platform = getPlatform(conversation.platform)
  const applied = labels.filter((label) => conversation.labelIds.includes(label.id))

  return (
    <header className="shrink-0 border-b border-line-soft">
      {/* De la place à droite : la bille de l'assistant s'y installe */}
      <div className="flex items-center gap-3 py-3.5 pr-16 pl-4">
        {!embedded && (
          <Link
            to="/reception"
            className="-ml-1.5 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-ink-500 transition hover:bg-hover hover:text-ink-900"
          >
            <ArrowLeft className="h-[17px] w-[17px]" aria-hidden />
            Retour
          </Link>
        )}

        <Avatar title={conversation.title} size={42} {...conversationPhotos(conversation, contacts)} />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[15.5px] font-semibold text-ink-900">{conversation.title}</h2>

            {conversation.isGroup && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-ground px-1.5 py-0.5 text-[10.5px] font-medium text-ink-500">
                <Users className="h-2.5 w-2.5" aria-hidden />
                {conversation.memberCount ?? ''} membres
              </span>
            )}
          </div>
          <p className="truncate text-[12px] text-ink-500">
            {conversation.subtitle ?? `${platform.name} · ${platform.conversationWord}`}
          </p>
        </div>

        {/* L'application d'où vient la conversation, à côté du nom et des coordonnées */}
        <PlatformLogo platform={conversation.platform} size={30} className="shrink-0" />

        <div className="flex-1" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line-soft px-4 py-2">
        {conversation.subject && (
          <p className="mr-1 min-w-0 flex-1 truncate text-[13px] text-ink-700">
            <span className="text-ink-400">Objet : </span>
            {conversation.subject}
          </p>
        )}

        {applied.map((label) => (
          <LabelChip key={label.id} label={label} />
        ))}

        <Popover
          align="right"
          triggerClassName={cx(
            'flex items-center gap-1 rounded-full border border-line bg-card px-2 py-0.5 text-[11.5px] font-medium text-ink-500 transition hover:text-ink-900',
            !conversation.subject && 'ml-auto',
          )}
          trigger={
            <>
              <Tag className="h-3 w-3" aria-hidden />
              Étiqueter
            </>
          }
        >
          {() => (
            <div className="space-y-0.5">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabelOnConversation(conversation.id, label.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-hover"
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    {conversation.labelIds.includes(label.id) && <Check className="h-3.5 w-3.5 text-eko-600" />}
                  </span>
                  <LabelChip label={label} />
                </button>
              ))}
            </div>
          )}
        </Popover>
      </div>
    </header>
  )
}
