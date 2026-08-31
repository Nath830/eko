import type { PlatformId } from '../config/platforms'

/* ============================================================================
   LA FORME DES DONNÉES D'Eko

   Ce fichier décrit tout ce que l'application manipule. Il ne contient aucun
   contenu : le contenu vit dans /src/data/.
============================================================================ */

/* ------------------------------- Étiquettes ------------------------------- */

/** 'auto' = posée par Eko d'après le sujet détecté · 'manual' = créée par vous */
export type LabelKind = 'auto' | 'manual'

export interface Label {
  id: string
  name: string
  color: string
  kind: LabelKind
}

/* -------------------------------- Contacts -------------------------------- */

export interface ContactHandle {
  platform: PlatformId
  /** Adresse, numéro ou pseudo utilisé sur cette plateforme */
  handle: string
}

export interface Contact {
  id: string
  fullName: string
  role?: string
  company?: string
  /** Les plateformes sur lesquelles vous échangez avec cette personne */
  handles: ContactHandle[]
  /** Portrait dans la planche src/data/portraits.ts (0 à 5) */
  photo: number
  /** Résumé rédigé par Eko : qui est cette personne, où vous en êtes ensemble */
  ekoSummary: string
  /** Passe à vrai dès que l'utilisateur modifie le résumé lui-même */
  summaryEditedByUser?: boolean
}

/* -------------------------------- Messages -------------------------------- */

export type AttachmentKind = 'devis' | 'contrat' | 'facture' | 'document' | 'image'

export interface Attachment {
  id: string
  fileName: string
  kind: AttachmentKind
  sizeLabel: string
  /** Aperçu d'une image ajoutée depuis l'appareil */
  previewUrl?: string
}

export interface VoiceNote {
  durationSec: number
  /** Transcription révélée par le bouton « Transcrire » */
  transcript: string
}

export interface Message {
  id: string
  from: 'me' | 'them'
  /** Nom de l'auteur — utile dans les groupes et les canaux */
  authorName?: string
  text?: string
  /** Version mise en forme, pour les messages rédigés dans l'éditeur des mails */
  html?: string
  sentAt: string
  voice?: VoiceNote
  attachments?: Attachment[]
  /** Rendez-vous détecté par Eko dans ce message */
  eventProposalId?: string
}

/* ------------------------------ Conversations ----------------------------- */

/** Un sujet : ce qui relie des échanges éparpillés sur plusieurs plateformes.
    Deux messages d'une même personne sur deux sujets différents ne sont jamais
    rapprochés — c'est le sujet qui fait le lien, pas l'interlocuteur. */
export interface Topic {
  id: string
  name: string
  /** Ce que le sujet recouvre, en une ligne */
  tagline: string
  /** Deux ou trois phrases : l'essentiel de la situation */
  miniSummary: string
  context: string
  keyPoints: string[]
  expectedFromYou: string[]
}

export interface Conversation {
  id: string
  platform: PlatformId
  /** Contact principal — absent pour les groupes et les canaux */
  contactId?: string
  title: string
  subtitle?: string
  /** Objet du mail ou sujet du canal */
  subject?: string
  /** Aperçu d'une ligne rédigé par Eko, affiché dans la réception */
  ekoDigest: string
  isGroup?: boolean
  /** Nombre de membres, affiché sur les groupes et les canaux */
  memberCount?: number
  participantIds?: string[]
  labelIds: string[]
  unreadCount: number
  /** Depuis quand cette conversation attend une réponse de votre part */
  awaitingReplySince?: string
  /** Le sujet auquel cet échange appartient */
  topicId?: string
  /** Le rôle de cet échange dans le sujet : « Contrat signé reçu » */
  topicRole?: string
  messages: Message[]
}

/* --------------------------- Contenus générés Eko -------------------------- */

/** Résumé pré-écrit d'une conversation (pilier RECEVOIR) */
export interface ConversationSummary {
  conversationId: string
  context: string
  keyPoints: string[]
  /** Mis en avant dans le panneau : « Ce qui est attendu de vous » */
  expectedFromYou: string[]
}

export type ReplyIntent = 'accepter' | 'delai' | 'question' | 'decliner'

export interface SuggestedReply {
  intent: ReplyIntent
  label: string
  text: string
}

/** Deux séries de brouillons : la seconde sort au clic sur « Régénérer » */
export interface SuggestedReplySet {
  conversationId: string
  series: SuggestedReply[][]
}

/** Résumé transversal : « où on en est avec Julien ? » */
export interface CrossChannelSummary {
  contactId: string
  question: string
  intro: string
  items: {
    platform: PlatformId
    date: string
    text: string
  }[]
  conclusion: string
}

/* --------------------------------- Alertes -------------------------------- */

export type AlertScope = 'all' | PlatformId

export interface Alert {
  id: string
  /** Formulée en langage naturel : « préviens-moi si je reçois le devis de Julien » */
  query: string
  contactId?: string
  scope: AlertScope
  active: boolean
  createdAt: string
}

export interface AlertHit {
  id: string
  alertId: string
  conversationId: string
  messageId: string
  triggeredAt: string
  isRead: boolean
}

/* ---------------------------- Notes et historique -------------------------- */

export type NoteAuthor = 'me' | 'eko'

/** Ce qu'une note peut désigner : une personne, une conversation, un sujet
    ou une étiquette. C'est ce qui permet à Eko de rattacher la note au bon
    dossier et d'en tenir compte quand il fait le point. */
export type MentionKind = 'contact' | 'conversation' | 'topic' | 'label'

export interface Mention {
  kind: MentionKind
  id: string
  /** Le libellé écrit dans la note : « @Julien Meyer » */
  label: string
}

export interface Note {
  id: string
  title?: string
  body: string
  author: NoteAuthor
  createdAt: string
  /** Rattachement facultatif à une conversation et/ou un contact */
  conversationId?: string
  contactId?: string
  /** Personnes, conversations, sujets et étiquettes cités dans la note */
  mentions?: Mention[]
}

export type TimelineKind = 'message' | 'attachment' | 'event' | 'note' | 'alert'

export interface TimelineEntry {
  id: string
  kind: TimelineKind
  platform?: PlatformId
  date: string
  title: string
  detail?: string
  conversationId?: string
}

/* -------------------------------- Calendrier ------------------------------- */

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  contactId?: string
  /** Vrai pour les événements arrivés via la connexion Google Calendar simulée */
  fromGoogle?: boolean
  location?: string
}

/** Rendez-vous repéré par Eko dans un message, en attente d'acceptation */
export interface EventProposal {
  id: string
  conversationId: string
  messageId: string
  contactId?: string
  title: string
  start: string
  end: string
  /** Extrait du message qui a permis la détection */
  sourceQuote: string
  status: 'pending' | 'accepted' | 'declined'
}

/* -------------------------------- Recherche -------------------------------- */

/** Requête en langage naturel pré-associée à ses résultats */
export interface NaturalQuery {
  /** Formulations reconnues, en minuscules et sans accents */
  patterns: string[]
  interpretation: string
  /** La phrase qu'Eko répond, comme le ferait un assistant */
  answer?: string
  results: {
    conversationId: string
    /** Le message exact à mettre en évidence, s'il y en a un */
    messageId?: string
  }[]
}
