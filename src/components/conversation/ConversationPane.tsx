import { useEffect, useMemo, useRef, useState } from 'react'
import { getReplySet } from '../../data/replies'
import { thinkingDelay } from '../../lib/simulate'
import type { Conversation, SuggestedReply } from '../../types'
import { ConversationHeader } from './ConversationHeader'
import { MessageComposer } from './MessageComposer'
import { MessageThread } from './MessageThread'

interface ConversationPaneProps {
  conversation: Conversation
  highlightMessageId?: string
  /** Affichée dans un panneau : le panneau fournit déjà retour et fermeture */
  embedded?: boolean
}

/* La conversation ouverte : en-tête, résumé de groupe, fil et saisie.

   À l'ouverture, Eko rédige une réponse et la place directement dans le champ.
   Une seule proposition à la fois, modifiable, jamais envoyée automatiquement.
   « Régénérer » en propose une autre, écrite elle aussi à la main dans les
   données (src/data/replies.ts). */
export function ConversationPane({ conversation, highlightMessageId, embedded }: ConversationPaneProps) {
  const [draft, setDraft] = useState('')
  const [draftNonce, setDraftNonce] = useState(0)
  const [drafting, setDrafting] = useState(false)
  const poolIndex = useRef(0)

  // Toutes les réponses écrites pour cette conversation, mises bout à bout :
  // la première est proposée, les suivantes sortent au clic sur « Régénérer ».
  const pool = useMemo(() => getReplySet(conversation.id)?.series.flat() ?? [], [conversation.id])

  function place(next: SuggestedReply) {
    setDraft(next.text)
    setDraftNonce((value) => value + 1)
  }

  // Changer de conversation : on repart de zéro, puis Eko propose une réponse.
  useEffect(() => {
    let cancelled = false

    setDraft('')
    setDraftNonce((value) => value + 1)
    poolIndex.current = 0

    if (pool.length === 0) return

    setDrafting(true)
    const timer = window.setTimeout(() => {
      if (cancelled) return
      setDrafting(false)
      place(pool[0])
    }, thinkingDelay())

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      setDrafting(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id, pool])

  function regenerate() {
    if (pool.length === 0) return

    poolIndex.current = (poolIndex.current + 1) % pool.length
    setDrafting(true)

    window.setTimeout(() => {
      setDrafting(false)
      place(pool[poolIndex.current])
    }, thinkingDelay())
  }

  return (
    <>
      <ConversationHeader conversation={conversation} embedded={embedded} />

      <MessageThread conversation={conversation} highlightMessageId={highlightMessageId} />

      <MessageComposer
        conversation={conversation}
        draft={draft}
        onDraftChange={setDraft}
        draftNonce={draftNonce}
        ekoDrafting={drafting}
        onRegenerateDraft={regenerate}
      />
    </>
  )
}
