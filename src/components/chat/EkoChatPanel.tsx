import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { PlatformId } from '../../config/platforms'
import { useChat } from '../../store/ChatContext'
import { useEko } from '../../store/EkoStore'
import { EkoWordmark } from '../ui/EkoMark'
import { PlatformLogo } from '../ui/PlatformLogo'
import { ChatComposer } from './ChatComposer'
import { ChatView } from './ChatView'

interface EkoChatPanelProps {
  onClose: () => void
}

/* La conversation avec Eko, ouverte sur la droite depuis n'importe quel écran
   de l'application.

   Quand on lit une conversation, Eko la prend comme sujet : « résume » suffit
   alors, et une croix permet de s'en détacher pour parler d'autre chose. */
export function EkoChatPanel({ onClose }: EkoChatPanelProps) {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { getConversation } = useEko()
  const { turns, ask, contextConversationId, setContext } = useChat()

  // Ouvrir une conversation la propose automatiquement comme sujet.
  useEffect(() => {
    if (conversationId) setContext(conversationId)
  }, [conversationId, setContext])

  const context = getConversation(contextConversationId ?? undefined)
  const contextChip = context
    ? {
        label: context.title,
        icon: <PlatformLogo platform={context.platform} size={14} />,
      }
    : undefined

  function openConversation(id: string, messageId?: string) {
    navigate(messageId ? `/reception/${id}?message=${messageId}` : `/reception/${id}`)
  }

  return (
    <aside className="card flex h-full w-full shrink-0 flex-col overflow-hidden md:w-[440px] lg:w-[480px]">
      <header className="flex shrink-0 items-center gap-3 border-b border-line-soft px-4 py-3.5">
        <EkoWordmark height={16} className="text-ink-900" />
        <span className="text-[12.5px] text-ink-400">votre assistant</span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'assistant"
          className="ml-auto rounded-lg p-1.5 text-ink-400 transition hover:bg-hover hover:text-ink-900"
        >
          <X className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </header>

      <div className="min-h-0 flex-1 p-3.5">
        {turns.length === 0 ? (
          /* Rien encore demandé : le champ, et quelques pistes */
          <div className="flex h-full flex-col justify-end">
            <p className="mb-3 px-1 text-[13px] leading-relaxed text-ink-500">
              {context
                ? `Posez-moi une question sur ${context.title}, ou sur n'importe quel autre sujet.`
                : 'Posez-moi une question sur vos conversations, vos dossiers ou votre journée.'}
            </p>

            <ChatComposer
              onAsk={ask}
              autoFocus
              context={contextChip}
              onClearContext={() => setContext(null)}
              placeholder="Demandez à Eko…"
              shortcuts={[
                { label: 'Résume la situation', ask: 'résume-moi la situation' },
                { label: 'Ce que j’ai raté', ask: 'qu’est-ce que j’ai raté ?' },
                { label: 'Mes priorités', ask: 'quelles sont mes priorités pour le reste de la journée ?' },
              ]}
            />
          </div>
        ) : (
          <ChatView
            compact
            context={contextChip}
            onClearContext={() => setContext(null)}
            onBack={onClose}
            backLabel="Fermer"
            onOpen={openConversation}
            onOpenContact={(contactId) => navigate(`/contacts/${contactId}`)}
            onOpenPlatform={(platform: PlatformId) => {
              navigate('/reception')
              onClose()
              void platform
            }}
          />
        )}
      </div>
    </aside>
  )
}
