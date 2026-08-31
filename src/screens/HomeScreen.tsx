import { useState } from 'react'
import { ChatView } from '../components/chat/ChatView'
import { ChatComposer } from '../components/chat/ChatComposer'
import { ConversationPanel } from '../components/home/ConversationPanel'
import { HomeRail } from '../components/home/HomeRail'
import { InboxPreviewPanel } from '../components/home/InboxPreviewPanel'
import { PlatformPanel } from '../components/home/PlatformPanel'
import { PriorityPanel } from '../components/home/PriorityPanel'
import { PlatformLogo } from '../components/ui/PlatformLogo'
import { getPlatform, type PlatformId } from '../config/platforms'
import { USER, greeting } from '../config/user'
import { conversationsOfContact, lastMessage } from '../lib/conversations'
import { formatListTimestamp } from '../lib/date'
import { MessageSquare } from 'lucide-react'
import { useChat } from '../store/ChatContext'
import { useEko } from '../store/EkoStore'

const SHORTCUTS = [
  { label: 'Où en est Vertex ?', ask: 'où en est le dossier du client Julien, où est le devis et où en est la situation ?' },
  { label: 'Ce que j’ai raté', ask: 'qu’est-ce que j’ai raté ?' },
  { label: 'Mes priorités', ask: 'quelles sont mes priorités pour le reste de la journée ?' },
  { label: 'Mes alertes', ask: 'mes alertes' },
]

/* La page d'accueil.

   Tant qu'aucune question n'est posée : le bonjour, les conversations clés et
   le champ d'Eko. Dès la première question, tout cela s'efface et la
   conversation avec Eko prend toute la page — seul le rail reste, pour revenir
   à l'accueil ou passer à la réception. */
export function HomeScreen() {
  const { priorityConversations, conversations, unreadTotal } = useEko()
  const { turns, ask, hidden, show } = useChat()

  const [platform, setPlatform] = useState<PlatformId | undefined>()
  const [inboxOpen, setInboxOpen] = useState(false)
  const [priorityOpen, setPriorityOpen] = useState(false)
  const [asked, setAsked] = useState<{ conversationId: string; messageId?: string } | null>(null)

  const chatting = turns.length > 0 && !hidden

  function closePanels() {
    setInboxOpen(false)
    setPriorityOpen(false)
    setPlatform(undefined)
    setAsked(null)
  }

  /** Une référence citée par Eko s'ouvre dans le panneau de droite. */
  function openConversation(conversationId: string, messageId?: string) {
    closePanels()
    setAsked({ conversationId, messageId })
  }

  /** Une personne citée : sa conversation la plus récente. */
  function openContact(contactId: string) {
    const theirs = conversationsOfContact(conversations, contactId)
    if (theirs.length > 0) openConversation(theirs[0].id)
  }

  const key = (priorityConversations.length > 0 ? priorityConversations : conversations).slice(0, 3)

  return (
    <div className="relative h-full overflow-hidden bg-white">
      {/* Les deux teintes de la marque, en halos sur les bords */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-56 -left-64 h-[820px] w-[820px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFB284 0%, #FFCAAC 42%, rgba(255,202,172,0) 72%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 -left-40 h-[620px] w-[620px] rounded-full opacity-90 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFCAAC 0%, rgba(255,202,172,0) 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-64 -bottom-56 h-[880px] w-[880px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #97F2D8 0%, #DAFFF2 44%, rgba(218,255,242,0) 72%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-52 -right-40 h-[600px] w-[600px] rounded-full opacity-90 blur-3xl"
        style={{ background: 'radial-gradient(circle, #B6F6E4 0%, rgba(218,255,242,0) 72%)' }}
      />

      <HomeRail
        activePlatform={platform}
        inboxOpen={inboxOpen}
        priorityOpen={priorityOpen}
        onOpenInbox={() => {
          closePanels()
          setInboxOpen(true)
        }}
        onOpenPriority={() => {
          closePanels()
          setPriorityOpen(true)
        }}
        onPickPlatform={(id) => {
          closePanels()
          setPlatform(id)
        }}
      />

      {chatting ? (
        /* La conversation avec Eko occupe toute la page */
        <div className="relative h-full pt-safe pr-4 pb-4 pl-16 md:pl-24">
          <div className="mx-auto h-full max-w-[820px]">
            <ChatView
              onOpen={openConversation}
              onOpenContact={openContact}
              onOpenPlatform={(id) => {
                closePanels()
                setPlatform(id)
              }}
            />
          </div>
        </div>
      ) : (
        <div className="scrollbar-slim relative h-full overflow-y-auto px-4 pt-safe pb-6">
          <div className="mx-auto flex min-h-full max-w-[620px] flex-col justify-center gap-7 py-10 pl-16 md:pl-20">
            <h1
              className="text-[42px] leading-[1.08] font-light tracking-[-0.01em] text-ink-900 md:text-[52px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {greeting()}, {USER.firstName}
            </h1>

            <section>
              <h2 className="mb-2 text-[11.5px] font-semibold tracking-wider text-ink-400 uppercase">
                Conversations clés
                <span className="ml-1.5 text-ink-300 normal-case">
                  · vos priorités{unreadTotal > 0 && ` · ${unreadTotal} non lus`}
                </span>
              </h2>

              <ul className="space-y-2">
                {key.map((conversation) => {
                  const meta = getPlatform(conversation.platform)
                  const last = lastMessage(conversation)

                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        onClick={() => openConversation(conversation.id)}
                        className="card flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition hover:shadow-lg"
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: meta.softColor }}
                        >
                          <PlatformLogo platform={conversation.platform} size={26} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline gap-2">
                            <span className="truncate text-[13.5px] font-semibold text-ink-900">{meta.name}</span>
                            <span className="truncate text-[12.5px] text-ink-500">{conversation.title}</span>
                            <span className="ml-auto shrink-0 text-[11.5px] text-ink-400 tabular-nums">
                              {last ? formatListTimestamp(last.sentAt) : ''}
                            </span>
                          </span>

                          <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-600">
                            {conversation.ekoDigest}
                          </span>
                        </span>

                        {conversation.unreadCount > 0 && (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-eko-accent" aria-label="Non lu" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* Le champ d'Eko : la première question ouvre le chat */}
            <div className="pt-1 pb-4">
              <ChatComposer onAsk={ask} shortcuts={SHORTCUTS} />

              {/* La conversation en cours reste à portée */}
              {turns.length > 0 && (
                <button
                  type="button"
                  onClick={show}
                  className="mt-2.5 flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink-700 transition hover:border-eko-500/40 hover:text-eko-700"
                >
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                  Reprendre la conversation
                  <span className="text-ink-400 tabular-nums">{turns.length}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {inboxOpen && (
        <InboxPreviewPanel
          onPickPlatform={(id) => {
            closePanels()
            setPlatform(id)
          }}
          onClose={() => setInboxOpen(false)}
        />
      )}
      {platform && (
        <PlatformPanel platform={platform} onSwitch={setPlatform} onClose={() => setPlatform(undefined)} />
      )}
      {priorityOpen && <PriorityPanel onClose={() => setPriorityOpen(false)} />}

      {asked && (
        <ConversationPanel
          conversationId={asked.conversationId}
          messageId={asked.messageId}
          onClose={() => setAsked(null)}
        />
      )}
    </div>
  )
}
