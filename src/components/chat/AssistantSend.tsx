import { Check, Paperclip, Send, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getPlatform } from '../../config/platforms'
import { useEkoGeneration } from '../../hooks/useEkoGeneration'
import { cx } from '../../lib/cx'
import { useEko } from '../../store/EkoStore'
import { useToast } from '../../store/ToastContext'
import type { Attachment, Conversation } from '../../types'
import { EkoTag } from '../ui/EkoTag'
import { PlatformLogo } from '../ui/PlatformLogo'
import { SkeletonLines } from '../ui/Skeleton'
import { RichText } from './RichText'

interface AssistantSendProps {
  contactId: string
  documentHint?: string
  withSummary: boolean
  onOpen: (conversationId: string, messageId?: string) => void
}

/* « Envoie le devis à Camille avec un résumé »

   Eko rédige le message, retrouve le document dans vos conversations, et
   attend votre validation avant d'envoyer quoi que ce soit. */
export function AssistantSend({ contactId, documentHint, withSummary, onOpen }: AssistantSendProps) {
  const { conversations, getContact, sendMessage } = useEko()
  const { notify } = useToast()
  const { status, run } = useEkoGeneration<string>()
  const [sent, setSent] = useState<string | null>(null)

  const contact = getContact(contactId)

  // Le document demandé, cherché dans toutes les conversations.
  const found = useMemo(() => findDocument(conversations, documentHint), [conversations, documentHint])

  // La conversation à utiliser : la plus récente avec cette personne.
  const target = useMemo(
    () => conversations.find((conversation) => conversation.contactId === contactId),
    [conversations, contactId],
  )

  const [draft, setDraft] = useState(() =>
    buildMessage(contact?.fullName.split(' ')[0] ?? '', found?.attachment.fileName, withSummary),
  )

  // Eko « rédige » un instant avant d'afficher le message.
  useEffect(() => {
    void run('', 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, documentHint])

  if (!contact) return null

  if (status === 'thinking') {
    return (
      <div className="surface-eko rounded-2xl border p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-pulse text-eko-600" aria-hidden />
          <span className="text-[13px] text-ink-500">Eko rédige le message et retrouve le document…</span>
        </div>
        <SkeletonLines lines={4} />
      </div>
    )
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-card p-5">
        <p className="flex items-center gap-2 text-[13.5px] font-medium text-ink-900">
          <Check className="h-4 w-4 text-ok" aria-hidden />
          Message envoyé à {contact.fullName}
        </p>
        <button
          type="button"
          onClick={() => onOpen(sent)}
          className="mt-2 text-[12.5px] font-medium text-eko-600 transition hover:text-eko-700"
        >
          Ouvrir la conversation →
        </button>
      </div>
    )
  }

  return (
    <div className="surface-eko rounded-2xl border p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-eko-600" aria-hidden />
        <h3 className="text-[14.5px] font-semibold text-ink-900">Message prêt à partir</h3>
        <EkoTag className="ml-auto">Eko</EkoTag>
      </div>

      <p className="mb-3 text-[13.5px] leading-[1.7] text-ink-700">
        <RichText
          text={`J'ai préparé un message pour ${contact.fullName}${
            target ? ` sur ${getPlatform(target.platform).name}` : ''
          }${found ? `, avec ${found.attachment.fileName} en pièce jointe` : ''}. Relisez-le avant l'envoi.`}
        />
      </p>

      {/* Le destinataire */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-500">
        <span>À</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-2 py-1 font-medium text-ink-900">
          {target && <PlatformLogo platform={target.platform} size={14} />}
          {contact.fullName}
        </span>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={7}
        aria-label="Message à envoyer"
        className="scrollbar-slim w-full resize-none rounded-xl border border-line bg-card px-3.5 py-3 text-[13.5px] leading-relaxed text-ink-900 focus:border-eko-500/50 focus:outline-none"
      />

      {found && (
        <button
          type="button"
          onClick={() => onOpen(found.conversation.id, found.messageId)}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 text-left transition hover:shadow-sm"
        >
          <Paperclip className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-medium text-ink-900">
              {found.attachment.fileName}
            </span>
            <span className="block text-[11px] text-ink-400">
              {found.attachment.sizeLabel} · trouvé dans {found.conversation.title}
            </span>
          </span>
          <PlatformLogo platform={found.conversation.platform} size={14} />
        </button>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          disabled={!target}
          onClick={() => {
            if (!target) return

            sendMessage(target.id, {
              text: draft,
              attachments: found ? [found.attachment] : undefined,
            })
            setSent(target.id)
            notify(`Message envoyé à ${contact.fullName}`, {
              tone: 'success',
              to: `/reception/${target.id}`,
              actionLabel: 'Ouvrir la conversation',
            })
          }}
          className={cx(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition',
            target ? 'bg-eko-500 text-white hover:bg-eko-600' : 'bg-ground text-ink-300',
          )}
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
          Envoyer
        </button>

        <span className="text-[11.5px] text-ink-400">Rien ne part tant que vous n'avez pas validé.</span>
      </div>
    </div>
  )
}

interface FoundDocument {
  attachment: Attachment
  conversation: Conversation
  messageId: string
}

/** Le document évoqué, retrouvé dans n'importe quelle conversation. */
function findDocument(conversations: Conversation[], hint?: string): FoundDocument | null {
  if (!hint) return null

  for (const conversation of conversations) {
    for (const message of conversation.messages) {
      for (const attachment of message.attachments ?? []) {
        const haystack = `${attachment.fileName} ${attachment.kind}`.toLowerCase()
        if (haystack.includes(hint.toLowerCase())) {
          return { attachment, conversation, messageId: message.id }
        }
      }
    }
  }

  return null
}

function buildMessage(firstName: string, document?: string, withSummary?: boolean): string {
  const lines = [`Bonjour ${firstName},`, '']

  if (document) lines.push(`Je te transmets ${document} pour information.`, '')

  if (withSummary) {
    lines.push(
      "En deux mots : le devis a été validé à 14 200 € après arbitrage, le démarrage est décalé au début du mois prochain, et le contrat signé nous est parvenu. Le premier jalon portera uniquement sur la typographie et le logo.",
      '',
    )
  }

  lines.push('Dis-moi si tu veux qu’on en reparle de vive voix.', '', 'Bonne journée')

  return lines.join('\n')
}
