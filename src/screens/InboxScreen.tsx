import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ConversationPane } from '../components/conversation/ConversationPane'
import { InboxPanel } from '../components/inbox/InboxPanel'
import { useEko } from '../store/EkoStore'

/* Boîte de réception.

   Sans conversation ouverte, la liste occupe tout l'espace. Dès qu'on en
   ouvre une, elle prend toute la largeur et la liste s'efface — « Retour »
   ramène à la liste.

   Le point sur un sujet ne se demande plus ici : on le demande à Eko, dans
   la barre du haut, et il répond en recousant toutes les plateformes. */
export function InboxScreen() {
  const { conversationId } = useParams()
  const [searchParams] = useSearchParams()
  const { getConversation, markAsRead } = useEko()

  const selected = getConversation(conversationId)
  const highlightMessageId = searchParams.get('message') ?? undefined

  // Ouvrir une conversation la marque comme lue.
  useEffect(() => {
    if (selected) markAsRead(selected.id)
  }, [selected, markAsRead])

  if (!selected) {
    return (
      <div className="h-full min-h-0">
        <InboxPanel activeId={conversationId} />
      </div>
    )
  }

  return (
    <section className="card card-focus flex h-full min-h-0 flex-col overflow-hidden ring-1 ring-eko-500/20">
      <ConversationPane conversation={selected} highlightMessageId={highlightMessageId} />
    </section>
  )
}
