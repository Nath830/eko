import type { CalendarEvent, EventProposal } from '../types'
import { daysAgo } from '../lib/time'

/* ============================================================================
   CALENDRIER

   Les événements Google n'apparaissent qu'une fois la connexion simulée
   effectuée depuis l'écran Calendrier. Les propositions sont les rendez-vous
   qu'Eko a repérés dans les messages.
============================================================================ */

/** Un créneau, situé par rapport à aujourd'hui. daysAhead peut être négatif. */
function slot(daysAhead: number, from: string, to: string): { start: string; end: string } {
  return { start: daysAgo(-daysAhead, from), end: daysAgo(-daysAhead, to) }
}

/* L'agenda que vous tenez déjà dans Eko, avant toute connexion à Google.
   C'est lui qui permet à Eko de repérer un créneau déjà pris et d'en proposer
   d'autres. */
export const localEvents: CalendarEvent[] = [
  { id: 'loc-1', title: 'Point hebdomadaire studio', ...slot(1, '10:00', '11:00'), location: 'Visio' },
  { id: 'loc-2', title: 'Appel Atelier Nord', ...slot(1, '14:00', '15:00'), contactId: 'sarah', location: 'Téléphone' },
  { id: 'loc-3', title: 'Comité Studio Vertex', ...slot(2, '14:00', '15:30'), contactId: 'julien', location: 'Studio Vertex' },
  { id: 'loc-4', title: 'Revue de maquettes', ...slot(3, '10:00', '11:30'), location: 'Visio' },
  { id: 'loc-5', title: 'Déjeuner équipe', ...slot(4, '12:30', '14:00') },
]

export const googleEvents: CalendarEvent[] = [
  { id: 'evt-1', title: 'Point hebdomadaire studio', ...slot(0, '09:30', '10:00'), fromGoogle: true, location: 'Visio' },
  { id: 'evt-2', title: 'Déjeuner avec Camille', ...slot(0, '12:30', '14:00'), contactId: 'camille', fromGoogle: true, location: 'Rue de Charonne' },
  { id: 'evt-3', title: 'Revue de maquettes Vertex', ...slot(1, '10:00', '11:30'), fromGoogle: true, location: 'Visio' },
  { id: 'evt-4', title: 'Atelier céramique', ...slot(1, '18:00', '20:00'), fromGoogle: true },
  { id: 'evt-5', title: 'Appel Atelier Nord — production', ...slot(2, '11:00', '11:45'), contactId: 'sarah', fromGoogle: true, location: 'Téléphone' },
  { id: 'evt-6', title: 'Livraison jalon 1 — typo et logo', ...slot(3, '09:00', '09:30'), fromGoogle: true },
  { id: 'evt-7', title: 'Comité Studio Vertex', ...slot(4, '15:00', '16:30'), contactId: 'julien', fromGoogle: true, location: 'Studio Vertex' },
  { id: 'evt-8', title: 'Dépôt TVA du trimestre', ...slot(4, '08:00', '08:30'), contactId: 'elodie', fromGoogle: true },
  { id: 'evt-9', title: 'Anniversaire surprise de Marc', ...slot(8, '19:30', '23:30'), contactId: 'nadia', fromGoogle: true, location: 'Chez Léa' },
  { id: 'evt-10', title: 'Point intégration avec Thomas', ...slot(-1, '16:00', '16:30'), contactId: 'thomas', fromGoogle: true, location: 'Visio' },
]

export const eventProposals: EventProposal[] = [
  {
    id: 'prop-julien-mardi',
    conversationId: 'wa-julien',
    messageId: 'julien-proposition-rdv',
    contactId: 'julien',
    title: 'Point Vertex avec Julien Meyer',
    ...slot(1, '14:00', '15:00'),
    sourceQuote: 'Je suis dispo mardi 14h si tu veux qu’on cale un point',
    status: 'pending',
  },
  {
    id: 'prop-camille-couleur',
    conversationId: 'slack-projet-vertex',
    messageId: 'camille-proposition-point',
    contactId: 'camille',
    title: 'Trancher la couleur des boutons secondaires',
    ...slot(0, '17:00', '17:30'),
    sourceQuote: 'On tranche cet après-midi ?',
    status: 'pending',
  },
]
