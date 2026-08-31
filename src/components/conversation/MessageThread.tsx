import { useEffect, useRef } from 'react'
import { formatDaySeparator, isSameDay } from '../../lib/date'
import { cx } from '../../lib/cx'
import type { Conversation } from '../../types'
import { MessageBubble } from './MessageBubble'

interface MessageThreadProps {
  conversation: Conversation
  /** Message à mettre en évidence après une recherche */
  highlightMessageId?: string
}

/** Historique complet d'une conversation, séparé par journées. */
export function MessageThread({ conversation, highlightMessageId }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const messageCount = conversation.messages.length

  // Ouverture normale : on se place sur le dernier message.
  // Arrivée depuis la recherche : on se place sur le message trouvé.
  useEffect(() => {
    if (highlightMessageId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    const container = scrollRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [conversation.id, messageCount, highlightMessageId])

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={scrollRef} className="scrollbar-slim h-full overflow-y-auto bg-ground/45 px-4 py-4">
        <div className="flex max-w-3xl flex-col gap-1.5">
          {conversation.messages.map((message, index) => {
            const previous = conversation.messages[index - 1]
            const startsNewDay = !previous || !isSameDay(previous.sentAt, message.sentAt)
            const isNewAuthor = !previous || previous.from !== message.from || previous.authorName !== message.authorName
            const isHighlighted = message.id === highlightMessageId

            return (
              <div
                key={message.id}
                ref={isHighlighted ? highlightRef : undefined}
                className={cx(startsNewDay || isNewAuthor ? 'mt-2 first:mt-0' : undefined)}
              >
                {startsNewDay && (
                  <div className="my-4 flex justify-center first:mt-0">
                    <span className="rounded-full border border-line bg-card px-2.5 py-1 text-[11px] font-medium text-ink-500">
                      {formatDaySeparator(message.sentAt)}
                    </span>
                  </div>
                )}

                <MessageBubble
                  message={message}
                  conversation={conversation}
                  platform={conversation.platform}
                  showAuthor={isNewAuthor}
                  highlighted={isHighlighted}
                />
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
