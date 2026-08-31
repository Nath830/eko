import type { Alert, AlertHit, Message } from '../types'
import { daysAgo, hoursAgo } from '../lib/time'

/* ============================================================================
   ALERTES

   Les alertes se créent en langage naturel. Les déclenchements ci-dessous
   sont pré-écrits : ils pointent vers de vrais messages du corpus.
============================================================================ */

export const alerts: Alert[] = [
  {
    id: 'alerte-devis-julien',
    query: 'Préviens-moi si je reçois le devis signé de Julien',
    contactId: 'julien',
    scope: 'all',
    active: true,
    createdAt: daysAgo(12, '09:30'),
  },
  {
    id: 'alerte-resiliation',
    query: 'Alerte-moi si un client parle de résiliation',
    scope: 'all',
    active: true,
    createdAt: daysAgo(9, '14:10'),
  },
  {
    id: 'alerte-tva',
    query: 'Préviens-moi quand Élodie relance sur la TVA',
    contactId: 'elodie',
    scope: 'teams',
    active: true,
    createdAt: daysAgo(6, '10:05'),
  },
  {
    id: 'alerte-recrutement',
    query: 'Signale-moi les approches de recrutement sur LinkedIn',
    scope: 'linkedin',
    active: false,
    createdAt: daysAgo(15, '17:45'),
  },
]

export const alertHits: AlertHit[] = [
  {
    id: 'hit-contrat',
    alertId: 'alerte-devis-julien',
    conversationId: 'li-julien',
    messageId: 'julien-contrat-signe',
    triggeredAt: daysAgo(1, '19:12'),
    isRead: false,
  },
  {
    id: 'hit-tva',
    alertId: 'alerte-tva',
    conversationId: 'teams-elodie',
    messageId: 'elodie-relance-teams',
    triggeredAt: hoursAgo(8),
    isRead: false,
  },
  {
    id: 'hit-relance-sarah',
    alertId: 'alerte-resiliation',
    conversationId: 'email-atelier-nord',
    messageId: 'sarah-derniere-relance',
    triggeredAt: hoursAgo(2),
    isRead: true,
  },
]

/* ---------------------------------------------------------------------------
   DÉCLENCHEMENTS SCÉNARISÉS

   Le moment fort de la démonstration : un bouton fait arriver un message
   qui correspond à une alerte, avec la notification qui va avec.
   Jouable à la demande, autant de fois qu'on veut.
--------------------------------------------------------------------------- */

export interface ScriptedTrigger {
  id: string
  /** Ce que l'on annonce dans le bouton */
  label: string
  alertId: string
  conversationId: string
  /** Le message qui arrive — son horodatage est calculé à l'instant du clic */
  message: Omit<Message, 'sentAt'>
  /** Texte de la notification affichée à l'écran */
  notification: string
}

export const scriptedTriggers: ScriptedTrigger[] = [
  {
    id: 'trigger-resiliation',
    label: 'Un client parle de résiliation',
    alertId: 'alerte-resiliation',
    conversationId: 'email-atelier-nord',
    message: {
      id: 'sarah-resiliation',
      from: 'them',
      text:
        "Bonjour,\n\nSans confirmation de votre part aujourd'hui, la direction m'a demandé d'étudier la résiliation du contrat de production et de repartir en consultation.\n\nJe préférerais évidemment l'éviter. Un mot de votre part suffirait.\n\nBien cordialement,\nSarah Nguyen",
    },
    notification: 'Alerte déclenchée — Sarah Nguyen parle de résiliation',
  },
  {
    id: 'trigger-julien-commande',
    label: 'Julien envoie le bon pour commande',
    alertId: 'alerte-devis-julien',
    conversationId: 'wa-julien',
    message: {
      id: 'julien-bon-commande',
      from: 'them',
      text: 'Le bon pour commande est signé aussi, je te l’envoie à l’instant 🎉 On démarre quand tu veux !',
      attachments: [
        { id: 'file-Bon_pour_commande_Vertex.pdf', fileName: 'Bon_pour_commande_Vertex.pdf', kind: 'contrat', sizeLabel: '340 Ko' },
      ],
    },
    notification: 'Alerte déclenchée — le bon pour commande de Julien vient d’arriver',
  },
]
