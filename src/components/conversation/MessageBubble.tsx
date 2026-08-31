import { getPlatform, type PlatformId } from '../../config/platforms'
import { avatarColor } from '../../lib/avatar'
import { cx } from '../../lib/cx'
import { formatTime } from '../../lib/date'
import type { Message } from '../../types'
import { detectEventInMessage } from '../../lib/eventDetection'
import type { Conversation } from '../../types'
import { AttachmentChip } from './AttachmentChip'
import { DetectedEventCard } from './DetectedEventCard'
import { EventProposalCard } from './EventProposalCard'
import { VoiceBubble } from './VoiceBubble'

interface MessageBubbleProps {
  message: Message
  conversation: Conversation
  platform: PlatformId
  /** Afficher le nom de l'auteur (canaux et groupes uniquement) */
  showAuthor?: boolean
  /** Le message est mis en évidence après une recherche */
  highlighted?: boolean
}

export function MessageBubble({
  message,
  conversation,
  platform,
  showAuthor,
  highlighted,
}: MessageBubbleProps) {
  const isMine = message.from === 'me'
  const { softColor, color } = getPlatform(platform)

  // Eko relit chaque message : une proposition de rendez-vous fait apparaître
  // une carte reliée à l'agenda, sans qu'on ait rien à étiqueter.
  const detected = detectEventInMessage(message, conversation)

  // Mes messages prennent la teinte de la plateforme ; le violet reste réservé à Eko.
  const mineStyle = { backgroundColor: softColor, borderColor: `color-mix(in srgb, ${color} 22%, transparent)` }

  const authorLabel = isMine ? 'Vous' : (message.authorName ?? conversation.title)

  return (
    <div className="flex w-full justify-start">
      <div className="w-full max-w-[560px]">
        {showAuthor && (
          <p
            className="mb-1 px-1 text-[12px] font-semibold"
            style={{ color: isMine ? 'var(--color-ink-400)' : avatarColor(authorLabel) }}
          >
            {authorLabel}
          </p>
        )}

        <div
          className={cx(
            'inline-block rounded-2xl border px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-900 transition',
            isMine ? 'rounded-bl-md' : 'rounded-bl-md border-line bg-card',
            highlighted && 'ring-2 ring-eko-500/60 ring-offset-2 ring-offset-ground',
          )}
          style={isMine ? mineStyle : undefined}
        >
          {message.voice && <VoiceBubble voice={message.voice} mine={isMine} />}

          {message.html ? (
            // Contenu rédigé par vous dans l'éditeur des mails
            <div className="[&_a]:underline" dangerouslySetInnerHTML={{ __html: message.html }} />
          ) : (
            message.text && <p className="whitespace-pre-line">{message.text}</p>
          )}

          {message.attachments?.map((attachment) => (
            <AttachmentChip key={attachment.id} attachment={attachment} />
          ))}

          <time dateTime={message.sentAt} className="mt-1 block text-right text-[10.5px] text-ink-400 tabular-nums">
            {formatTime(message.sentAt)}
          </time>
        </div>

        {message.eventProposalId && <EventProposalCard proposalId={message.eventProposalId} />}

        {detected && <DetectedEventCard event={detected} />}
      </div>
    </div>
  )
}
