import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { PlatformId } from '../config/platforms'
import { alertHits as initialHits, alerts as initialAlerts, type ScriptedTrigger } from '../data/alerts'
import { eventProposals as initialProposals, googleEvents, localEvents } from '../data/calendar'
import { contacts as initialContacts } from '../data/contacts'
import { conversations as initialConversations } from '../data/conversations'
import { labels as initialLabels } from '../data/labels'
import { notes as initialNotes } from '../data/notes'
import { initialPriorityIds } from '../data/priorities'
import { sortByRecency, totalUnread, unreadByPlatform } from '../lib/conversations'
import { detectEventsInConversations, type DetectedEvent } from '../lib/eventDetection'
import { EMPTY_FILTERS, applyFilters, type Filters } from '../lib/filters'
import { wait } from '../lib/simulate'
import type {
  Alert,
  AlertHit,
  Attachment,
  CalendarEvent,
  Contact,
  Conversation,
  EventProposal,
  Label,
  Mention,
  Note,
} from '../types'

/* ============================================================================
   L'ÉTAT DE LA DÉMONSTRATION

   Tout vit en mémoire : aucun serveur, aucune sauvegarde, aucune API.
   Le bouton « Réinitialiser la démo » des Réglages appelle resetDemo() et
   remet l'ensemble dans son état initial.
============================================================================ */

interface EkoValue {
  /* --- Conversations --- */
  conversations: Conversation[]
  visibleConversations: Conversation[]
  unreadTotal: number
  unreadPerPlatform: Partial<Record<PlatformId, number>>
  getConversation: (id: string | undefined) => Conversation | undefined
  markAsRead: (id: string) => void
  sendMessage: (id: string, content: { text: string; html?: string; attachments?: Attachment[] }) => void
  sendVoiceMessage: (id: string, durationSec: number) => void

  /* --- Priorités --- */
  priorityIds: string[]
  priorityConversations: Conversation[]
  isPriority: (id: string) => boolean
  togglePriority: (id: string) => void

  /* --- Filtres et recherche --- */
  filters: Filters
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  toggleLabelFilter: (labelId: string) => void
  clearFilters: () => void

  /* --- Étiquettes --- */
  labels: Label[]
  createLabel: (name: string, color: string) => void
  toggleLabelOnConversation: (conversationId: string, labelId: string) => void

  /* --- Contacts --- */
  contacts: Contact[]
  getContact: (id: string | undefined) => Contact | undefined
  updateContactSummary: (id: string, summary: string) => void

  /* --- Notes --- */
  notes: Note[]
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'author'>) => string
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body'>>) => void
  /** Citer une personne, une conversation, un sujet ou une étiquette */
  addMention: (noteId: string, mention: Mention) => void
  removeMention: (noteId: string, mention: Mention) => void
  deleteNote: (id: string) => void

  /* --- Alertes --- */
  alerts: Alert[]
  alertHits: AlertHit[]
  unreadAlerts: number
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'active'>) => void
  toggleAlert: (id: string) => void
  markHitRead: (id: string) => void
  runScriptedTrigger: (trigger: ScriptedTrigger) => void

  /* --- Calendrier --- */
  googleConnected: boolean
  connectingGoogle: boolean
  connectGoogle: () => Promise<void>
  events: CalendarEvent[]
  proposals: EventProposal[]
  /** Rendez-vous repérés par Eko dans les messages, encore sans réponse */
  detectedEvents: DetectedEvent[]
  /** Ce qu'on a décidé pour un créneau repéré, par signature de créneau */
  detectionStatus: Record<string, 'accepted' | 'declined'>
  acceptDetectedEvent: (event: DetectedEvent) => void
  declineDetectedEvent: (event: DetectedEvent) => void
  /** Ajoute un rendez-vous, par exemple depuis un ordre donné à Eko */
  createEvent: (event: Omit<CalendarEvent, 'id'>) => void
  acceptProposal: (id: string) => void
  declineProposal: (id: string) => void

  /* --- Démo --- */
  resetDemo: () => void
}

const EkoContext = createContext<EkoValue | null>(null)

/** Copies indépendantes des données d'origine, pour pouvoir y revenir. */
const fresh = {
  conversations: () => structuredClone(initialConversations),
  contacts: () => structuredClone(initialContacts),
  labels: () => structuredClone(initialLabels),
  notes: () => structuredClone(initialNotes),
  alerts: () => structuredClone(initialAlerts),
  hits: () => structuredClone(initialHits),
  proposals: () => structuredClone(initialProposals),
}

export function EkoProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(fresh.conversations)
  const [contacts, setContacts] = useState<Contact[]>(fresh.contacts)
  const [labels, setLabels] = useState<Label[]>(fresh.labels)
  const [notes, setNotes] = useState<Note[]>(fresh.notes)
  const [alerts, setAlerts] = useState<Alert[]>(fresh.alerts)
  const [alertHits, setAlertHits] = useState<AlertHit[]>(fresh.hits)
  const [proposals, setProposals] = useState<EventProposal[]>(fresh.proposals)
  const [extraEvents, setExtraEvents] = useState<CalendarEvent[]>([])
  const [detectionStatus, setDetectionStatus] = useState<Record<string, 'accepted' | 'declined'>>({})
  const [googleConnected, setGoogleConnected] = useState(false)
  const [connectingGoogle, setConnectingGoogle] = useState(false)
  const [priorityIds, setPriorityIds] = useState<string[]>(initialPriorityIds)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  /* ------------------------------ Dérivés ------------------------------- */

  const ordered = useMemo(() => sortByRecency(conversations), [conversations])
  const unreadTotal = useMemo(() => totalUnread(conversations), [conversations])
  const unreadPerPlatform = useMemo(() => unreadByPlatform(conversations), [conversations])
  const visibleConversations = useMemo(
    () => applyFilters(ordered, filters, alertHits),
    [ordered, filters, alertHits],
  )
  const unreadAlerts = useMemo(() => alertHits.filter((hit) => !hit.isRead).length, [alertHits])
  const priorityConversations = useMemo(
    () => ordered.filter((conversation) => priorityIds.includes(conversation.id)),
    [ordered, priorityIds],
  )
  const events = useMemo(
    () => [...localEvents, ...(googleConnected ? googleEvents : []), ...extraEvents],
    [googleConnected, extraEvents],
  )

  // Eko relit les messages en continu : un rendez-vous écrit à l'instant est
  // repéré aussi bien qu'un ancien.
  const detectedEvents = useMemo(
    () => detectEventsInConversations(conversations).filter((event) => !detectionStatus[event.signature]),
    [conversations, detectionStatus],
  )

  /* --------------------------- Conversations ---------------------------- */

  const getConversation = useCallback(
    (id: string | undefined) => conversations.find((conversation) => conversation.id === id),
    [conversations],
  )

  const patchConversation = useCallback((id: string, patch: (conversation: Conversation) => Conversation) => {
    setConversations((current) =>
      current.map((conversation) => (conversation.id === id ? patch(conversation) : conversation)),
    )
  }, [])

  const markAsRead = useCallback(
    (id: string) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === id && conversation.unreadCount > 0 ? { ...conversation, unreadCount: 0 } : conversation,
        ),
      )
    },
    [],
  )

  const sendMessage = useCallback<EkoValue['sendMessage']>(
    (id, content) => {
      const body = content.text.trim()
      if (!body && !content.attachments?.length) return

      patchConversation(id, (conversation) => ({
        ...conversation,
        unreadCount: 0,
        awaitingReplySince: undefined,
        messages: [
          ...conversation.messages,
          {
            id: `msg-envoye-${Date.now()}`,
            from: 'me',
            text: body,
            html: content.html,
            attachments: content.attachments,
            sentAt: new Date().toISOString(),
          },
        ],
      }))
    },
    [patchConversation],
  )

  const sendVoiceMessage = useCallback(
    (id: string, durationSec: number) => {
      patchConversation(id, (conversation) => ({
        ...conversation,
        unreadCount: 0,
        awaitingReplySince: undefined,
        messages: [
          ...conversation.messages,
          {
            id: `msg-vocal-${Date.now()}`,
            from: 'me',
            sentAt: new Date().toISOString(),
            voice: { durationSec, transcript: 'Transcription indisponible pour vos propres messages vocaux.' },
          },
        ],
      }))
    },
    [patchConversation],
  )

  /* ----------------------------- Priorités ------------------------------ */

  const isPriority = useCallback((id: string) => priorityIds.includes(id), [priorityIds])

  const togglePriority = useCallback((id: string) => {
    setPriorityIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current],
    )
  }, [])

  /* ------------------------------ Filtres ------------------------------- */

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }, [])

  const toggleLabelFilter = useCallback((labelId: string) => {
    setFilters((current) => ({
      ...current,
      labelIds: current.labelIds.includes(labelId)
        ? current.labelIds.filter((id) => id !== labelId)
        : [...current.labelIds, labelId],
    }))
  }, [])

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), [])

  /* ----------------------------- Étiquettes ----------------------------- */

  const createLabel = useCallback((name: string, color: string) => {
    const id = `label-${Date.now()}`
    setLabels((current) => [...current, { id, name, color, kind: 'manual' }])
  }, [])

  const toggleLabelOnConversation = useCallback(
    (conversationId: string, labelId: string) => {
      patchConversation(conversationId, (conversation) => ({
        ...conversation,
        labelIds: conversation.labelIds.includes(labelId)
          ? conversation.labelIds.filter((id) => id !== labelId)
          : [...conversation.labelIds, labelId],
      }))
    },
    [patchConversation],
  )

  /* ------------------------------ Contacts ------------------------------ */

  const getContact = useCallback(
    (id: string | undefined) => contacts.find((contact) => contact.id === id),
    [contacts],
  )

  const updateContactSummary = useCallback((id: string, summary: string) => {
    setContacts((current) =>
      current.map((contact) =>
        contact.id === id ? { ...contact, ekoSummary: summary, summaryEditedByUser: true } : contact,
      ),
    )
  }, [])

  /* -------------------------------- Notes ------------------------------- */

  const createNote = useCallback<EkoValue['createNote']>((note) => {
    const id = `note-${Date.now()}`
    setNotes((current) => [{ ...note, id, author: 'me', createdAt: new Date().toISOString() }, ...current])
    return id
  }, [])

  const updateNote = useCallback<EkoValue['updateNote']>((id, patch) => {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, ...patch } : note)))
  }, [])

  const addMention = useCallback((noteId: string, mention: Mention) => {
    setNotes((current) =>
      current.map((note) => {
        if (note.id !== noteId) return note
        if (note.mentions?.some((item) => item.kind === mention.kind && item.id === mention.id)) return note

        return {
          ...note,
          mentions: [...(note.mentions ?? []), mention],
          // La note s'écrit avec la mention dedans, comme on le ferait à la main.
          body: `${note.body}${note.body.endsWith(' ') || note.body === '' ? '' : ' '}@${mention.label} `,
        }
      }),
    )
  }, [])

  const removeMention = useCallback((noteId: string, mention: Mention) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === noteId
          ? {
              ...note,
              mentions: (note.mentions ?? []).filter(
                (item) => !(item.kind === mention.kind && item.id === mention.id),
              ),
              body: note.body.replace(`@${mention.label}`, '').replace(/\s{2,}/g, ' '),
            }
          : note,
      ),
    )
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id))
  }, [])

  /* ------------------------------- Alertes ------------------------------ */

  const createAlert = useCallback<EkoValue['createAlert']>((alert) => {
    setAlerts((current) => [
      { ...alert, id: `alerte-${Date.now()}`, active: true, createdAt: new Date().toISOString() },
      ...current,
    ])
  }, [])

  const toggleAlert = useCallback((id: string) => {
    setAlerts((current) => current.map((alert) => (alert.id === id ? { ...alert, active: !alert.active } : alert)))
  }, [])

  const markHitRead = useCallback((id: string) => {
    setAlertHits((current) => current.map((hit) => (hit.id === id ? { ...hit, isRead: true } : hit)))
  }, [])

  /** Le moment fort de la démo : un message arrive et déclenche une alerte. */
  const runScriptedTrigger = useCallback(
    (trigger: ScriptedTrigger) => {
      const sentAt = new Date().toISOString()
      const messageId = `${trigger.message.id}-${Date.now()}`

      patchConversation(trigger.conversationId, (conversation) => ({
        ...conversation,
        unreadCount: conversation.unreadCount + 1,
        messages: [...conversation.messages, { ...trigger.message, id: messageId, sentAt }],
      }))

      setAlertHits((current) => [
        {
          id: `hit-${Date.now()}`,
          alertId: trigger.alertId,
          conversationId: trigger.conversationId,
          messageId,
          triggeredAt: sentAt,
          isRead: false,
        },
        ...current,
      ])
    },
    [patchConversation],
  )

  /* ----------------------------- Calendrier ----------------------------- */

  const connectGoogle = useCallback(async () => {
    setConnectingGoogle(true)
    await wait(1500)
    setConnectingGoogle(false)
    setGoogleConnected(true)
  }, [])

  const createEvent = useCallback<EkoValue['createEvent']>((event) => {
    setExtraEvents((current) => [...current, { ...event, id: `evt-${Date.now()}` }])
  }, [])

  const acceptDetectedEvent = useCallback((event: DetectedEvent) => {
    setExtraEvents((current) => [
      ...current,
      {
        id: `evt-${event.signature}`,
        title: event.title,
        start: event.start,
        end: event.end,
        contactId: event.contactId,
      },
    ])
    setDetectionStatus((current) => ({ ...current, [event.signature]: 'accepted' }))
  }, [])

  const declineDetectedEvent = useCallback((event: DetectedEvent) => {
    setDetectionStatus((current) => ({ ...current, [event.signature]: 'declined' }))
  }, [])

  const acceptProposal = useCallback(
    (id: string) => {
      const proposal = proposals.find((item) => item.id === id)
      if (!proposal) return

      setProposals((current) =>
        current.map((item) => (item.id === id ? { ...item, status: 'accepted' } : item)),
      )
      setExtraEvents((current) => [
        ...current,
        {
          id: `evt-${proposal.id}`,
          title: proposal.title,
          start: proposal.start,
          end: proposal.end,
          contactId: proposal.contactId,
        },
      ])
    },
    [proposals],
  )

  const declineProposal = useCallback((id: string) => {
    setProposals((current) => current.map((item) => (item.id === id ? { ...item, status: 'declined' } : item)))
  }, [])

  /* -------------------------------- Démo -------------------------------- */

  const resetDemo = useCallback(() => {
    setConversations(fresh.conversations())
    setContacts(fresh.contacts())
    setLabels(fresh.labels())
    setNotes(fresh.notes())
    setAlerts(fresh.alerts())
    setAlertHits(fresh.hits())
    setProposals(fresh.proposals())
    setExtraEvents([])
    setDetectionStatus({})
    setPriorityIds(initialPriorityIds)
    setGoogleConnected(false)
    setConnectingGoogle(false)
    setFilters(EMPTY_FILTERS)
  }, [])

  const value: EkoValue = {
    conversations: ordered,
    visibleConversations,
    unreadTotal,
    unreadPerPlatform,
    getConversation,
    markAsRead,
    sendMessage,
    sendVoiceMessage,
    priorityIds,
    priorityConversations,
    isPriority,
    togglePriority,
    filters,
    setFilter,
    toggleLabelFilter,
    clearFilters,
    labels,
    createLabel,
    toggleLabelOnConversation,
    contacts,
    getContact,
    updateContactSummary,
    notes,
    createNote,
    updateNote,
    addMention,
    removeMention,
    deleteNote,
    alerts,
    alertHits,
    unreadAlerts,
    createAlert,
    toggleAlert,
    markHitRead,
    runScriptedTrigger,
    googleConnected,
    connectingGoogle,
    connectGoogle,
    events,
    proposals,
    detectedEvents,
    detectionStatus,
    acceptDetectedEvent,
    declineDetectedEvent,
    createEvent,
    acceptProposal,
    declineProposal,
    resetDemo,
  }

  return <EkoContext.Provider value={value}>{children}</EkoContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEko(): EkoValue {
  const value = useContext(EkoContext)
  if (!value) throw new Error('useEko doit être utilisé à l’intérieur de <EkoProvider>')
  return value
}
