import { ArrowLeft, History, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { PlatformId } from '../../config/platforms'
import { USER } from '../../config/user'
import { cx } from '../../lib/cx'
import { formatTime } from '../../lib/date'
import { useChat } from '../../store/ChatContext'
import { Avatar } from '../ui/Avatar'
import { Popover } from '../ui/Popover'
import { ChatAnswer } from './ChatAnswer'
import { ChatComposer } from './ChatComposer'

interface ChatViewProps {
  onOpen: (conversationId: string, messageId?: string) => void
  onOpenContact: (contactId: string) => void
  onOpenPlatform: (platform: PlatformId) => void
  /** Version étroite, dans le panneau de la réception */
  compact?: boolean
  /** Le sujet épinglé au-dessus du champ */
  context?: { label: string; icon?: React.ReactNode }
  onClearContext?: () => void
  /** Remplace le bouton « Accueil » quand on est dans l'application */
  onBack?: () => void
  backLabel?: string
}

/* La conversation avec Eko, en pleine page.

   Elle remplace l'accueil dès la première question : plus de salutation, plus
   de raccourcis, toute la place pour la réponse. L'historique reste
   consultable depuis un menu discret. */
export function ChatView({
  onOpen,
  onOpenContact,
  onOpenPlatform,
  compact,
  context,
  onClearContext,
  onBack,
  backLabel,
}: ChatViewProps) {
  const { turns, ask, clear, hide, focusedTurnId, focusTurn } = useChat()
  const anchors = useRef<Record<string, HTMLDivElement | null>>({})

  // On se place sur le dernier tour, ou sur celui choisi dans l'historique.
  useEffect(() => {
    const target = focusedTurnId ?? turns[turns.length - 1]?.id
    if (target) anchors.current[target]?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [focusedTurnId, turns.length])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Une barre discrète : nouvelle question, et l'historique */}
      <header className="flex shrink-0 items-center gap-2 px-1 pb-3">
        {/* Revenir à l'accueil sans perdre la conversation */}
        <button
          type="button"
          onClick={onBack ?? hide}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {backLabel ?? 'Accueil'}
        </button>

        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:text-ink-900"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Nouvelle question
        </button>

        <Popover
          align="left"
          triggerClassName="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:text-ink-900"
          trigger={
            <>
              <History className="h-3.5 w-3.5" aria-hidden />
              Historique
              <span className="text-ink-400 tabular-nums">{turns.length}</span>
            </>
          }
        >
          {(close) => (
            <div className="max-h-[320px] w-[300px] space-y-0.5 overflow-y-auto">
              {[...turns].reverse().map((turn) => (
                <button
                  key={turn.id}
                  type="button"
                  onClick={() => {
                    focusTurn(turn.id)
                    close()
                  }}
                  className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-hover"
                >
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[12.5px] leading-snug text-ink-900">{turn.question}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-400">{formatTime(turn.askedAt)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </Popover>
      </header>

      {/* Les échanges */}
      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-8 pb-6">
          {turns.map((turn) => (
            <div
              key={turn.id}
              ref={(node) => {
                anchors.current[turn.id] = node
              }}
              className="scroll-mt-2"
            >
              {/* La question */}
              <div className="mb-4 flex items-start gap-3">
                <Avatar title={USER.firstName} src={USER.photoUrl} size={compact ? 24 : 30} className="mt-0.5" />
                <p
                  className={cx(
                    'pt-0.5 leading-snug font-medium text-ink-900',
                    compact ? 'text-[14px]' : 'pt-1 text-[16px]',
                  )}
                >
                  {turn.question}
                </p>
              </div>

              {/* La réponse */}
              <div className={compact ? '' : 'pl-[42px]'}>
                <ChatAnswer
                  turn={turn}
                  onOpen={onOpen}
                  onOpenContact={onOpenContact}
                  onOpenPlatform={onOpenPlatform}
                  compact={compact}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* La suite de la conversation */}
      <div className="shrink-0 pt-2">
        <ChatComposer
          onAsk={ask}
          autoFocus
          context={context}
          onClearContext={onClearContext}
          placeholder="Poser une autre question, ou demander à Eko d'envoyer un document…"
          shortcuts={[
            { label: 'Résume la situation', ask: 'résume-moi la situation' },
            { label: 'Ce que j’ai raté', ask: 'qu’est-ce que j’ai raté ?' },
            { label: 'Mes priorités', ask: 'quelles sont mes priorités pour le reste de la journée ?' },
          ]}
        />
      </div>
    </div>
  )
}
