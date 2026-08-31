import type { PlatformId } from '../../config/platforms'
import type { ChatTurn } from '../../store/ChatContext'
import { AssistantAlerts } from '../inbox/AssistantAlerts'
import { AssistantBrief } from '../inbox/AssistantBrief'
import { AssistantDossier } from '../inbox/AssistantDossier'
import { AssistantMissed } from '../inbox/AssistantMissed'
import { AssistantSend } from './AssistantSend'
import { ChatSearchAnswer } from './ChatSearchAnswer'

interface ChatAnswerProps {
  turn: ChatTurn
  onOpen: (conversationId: string, messageId?: string) => void
  onOpenContact: (contactId: string) => void
  onOpenPlatform: (platform: PlatformId) => void
  /** Version étroite, dans le panneau de la réception */
  compact?: boolean
}

/** La réponse d'Eko à un tour de conversation, selon ce qu'il a compris. */
export function ChatAnswer({ turn, onOpen, onOpenContact, onOpenPlatform, compact }: ChatAnswerProps) {
  const { command, question } = turn

  if (command?.kind === 'dossier') {
    return (
      <AssistantDossier
        dossierId={command.dossierId}
        onOpen={onOpen}
        onOpenContact={onOpenContact}
        onOpenPlatform={onOpenPlatform}
        wide={!compact}
      />
    )
  }

  if (command?.kind === 'send') {
    return (
      <AssistantSend
        contactId={command.contactId}
        documentHint={command.documentHint}
        withSummary={command.withSummary}
        onOpen={onOpen}
      />
    )
  }

  if (command?.kind === 'brief') return <AssistantBrief kind={command.brief} onOpen={onOpen} />
  if (command?.kind === 'missed') return <AssistantMissed onOpen={onOpen} />
  if (command?.kind === 'alerts') return <AssistantAlerts onOpen={onOpen} />

  // Un ordre à confirmer, ou simplement une recherche : on retombe sur la
  // réponse courte, qui sait tout traiter.
  return <ChatSearchAnswer question={question} onOpen={onOpen} />
}
