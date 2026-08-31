import { Star, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { conversationPhotos, lastMessage } from '../../lib/conversations'
import { cx } from '../../lib/cx'
import { formatListTimestamp } from '../../lib/date'
import { useEko } from '../../store/EkoStore'
import type { Conversation } from '../../types'
import { Avatar } from '../ui/Avatar'
import { LabelChip } from '../ui/LabelChip'
import { PlatformLogo } from '../ui/PlatformLogo'

interface ConversationRowProps {
  conversation: Conversation
  isActive: boolean
  /** Fourni par les panneaux : la conversation s'ouvre sur place */
  onOpen?: (conversationId: string) => void
}

/* Une ligne de la réception.

   Un non-lu se reconnaît à trois choses : le liseré abricot à gauche, le fond
   menthe, et la typographie — nom en gras, texte foncé, logo à pleine
   opacité. Une ligne lue s'efface : graisse normale, texte gris, photo et
   logo estompés.

   L'étoile en haut à droite met la conversation en priorité. */
export function ConversationRow({ conversation, isActive, onOpen }: ConversationRowProps) {
  const { labels, contacts, isPriority, togglePriority } = useEko()
  const navigate = useNavigate()

  const latest = lastMessage(conversation)
  const isUnread = conversation.unreadCount > 0
  const starred = isPriority(conversation.id)
  const label = labels.find((item) => conversation.labelIds.includes(item.id))

  // Recliquer sur la conversation ouverte la referme : l'espace de lecture se vide.
  const target = isActive ? '/reception' : `/reception/${conversation.id}`

  return (
    <div
      className={cx(
        'relative flex items-start gap-3 rounded-2xl py-3.5 pr-3.5 pl-2 transition',
        isActive
          ? 'row-raised ring-1 ring-eko-500/30'
          : isUnread
            ? 'bg-eko-100/50 hover:row-raised'
            : 'hover:row-raised',
      )}
    >
      {/* Toute la ligne est cliquable, sauf l'étoile qui passe au-dessus */}
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(conversation.id)}
          aria-label={`Ouvrir la conversation avec ${conversation.title}`}
          className="absolute inset-0 rounded-2xl"
        />
      ) : (
        <Link
          to={target}
          aria-label={`Ouvrir la conversation avec ${conversation.title}`}
          className="absolute inset-0 rounded-2xl"
          onClick={(event) => {
            if (!isActive) return
            event.preventDefault()
            navigate('/reception')
          }}
        />
      )}

      {/* Le liseré qui signale un message pas encore ouvert */}
      <span
        className={cx(
          'my-1 w-[3px] shrink-0 self-stretch rounded-full',
          isUnread ? 'bg-eko-accent' : 'bg-transparent',
        )}
        aria-hidden
      />

      <Avatar
        title={conversation.title}
        size={48}
        {...conversationPhotos(conversation, contacts)}
        className={cx('pointer-events-none transition-opacity', !isUnread && 'opacity-55')}
      />

      <div className="pointer-events-none min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3
            className={cx(
              'truncate text-[15px]',
              isUnread ? 'font-semibold text-ink-900' : 'font-normal text-ink-500',
            )}
          >
            {conversation.title}
          </h3>

          {conversation.isGroup && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-ground px-1.5 py-0.5 text-[10.5px] font-medium text-ink-500">
              <Users className="h-2.5 w-2.5" aria-hidden />
              Groupe
            </span>
          )}

          <time
            className={cx(
              'ml-auto shrink-0 text-[11.5px] tabular-nums',
              isUnread ? 'font-semibold text-ink-900' : 'text-ink-300',
            )}
            dateTime={latest?.sentAt}
          >
            {latest ? formatListTimestamp(latest.sentAt) : ''}
          </time>
        </div>

        <p
          className={cx(
            'mt-0.5 line-clamp-2 text-[13px] leading-snug',
            isUnread ? 'text-ink-700' : 'text-ink-300',
          )}
        >
          {conversation.ekoDigest}
        </p>

        {(label || conversation.awaitingReplySince) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {conversation.awaitingReplySince && (
              <span className="rounded-full bg-warn/12 px-1.5 py-0.5 text-[10.5px] font-medium text-warn">
                En attente de vous
              </span>
            )}
            {label && <LabelChip label={label} />}
          </div>
        )}
      </div>

      {/* Étoile de priorité, puis logo de la plateforme */}
      <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 self-start">
        <button
          type="button"
          onClick={() => togglePriority(conversation.id)}
          aria-pressed={starred}
          title={starred ? 'Retirer des priorités' : 'Mettre en priorité'}
          className={cx(
            'rounded-lg p-1 transition',
            starred ? 'text-warn' : 'text-ink-200 hover:bg-ground hover:text-ink-500',
          )}
        >
          <Star className={cx('h-[17px] w-[17px]', starred && 'fill-current')} aria-hidden />
        </button>

        <PlatformLogo
          platform={conversation.platform}
          size={32}
          className={cx('pointer-events-none transition-opacity', !isUnread && 'opacity-45')}
        />
      </div>
    </div>
  )
}
