import type { Note } from '../types'
import { daysAgo, hoursAgo } from '../lib/time'

/* ============================================================================
   NOTES

   Deux formes : des notes libres, et des notes rattachées à une conversation
   ou à un contact. Celles écrites par Eko portent author: 'eko' et sont
   toujours signalées visuellement.
============================================================================ */

export const notes: Note[] = [
  {
    id: 'note-eko-vertex',
    title: 'Rapprochement automatique — dossier Vertex',
    body:
      "La demande de devis est partie par Gmail il y a 21 jours. La négociation s'est poursuivie sur WhatsApp, où Julien a laissé un vocal fixant le montant à 14 200 €. Le contrat signé est finalement arrivé par LinkedIn, la boîte mail de Studio Vertex étant saturée.\n\nLes trois canaux portent sur le même dossier : Eko les a rapprochés automatiquement.",
    author: 'eko',
    createdAt: hoursAgo(3),
    contactId: 'julien',
  },
  {
    id: 'note-eko-elodie',
    title: 'Rapprochement automatique — TVA du trimestre',
    body:
      "Élodie Marchand a d'abord écrit par Gmail il y a 16 jours, puis a basculé sur Teams il y a 5 jours faute de réponse. Les deux fils portent sur la même pièce manquante : le relevé de frais de déplacement.",
    author: 'eko',
    createdAt: daysAgo(2, '09:10'),
    contactId: 'elodie',
  },
  {
    id: 'note-vertex-phasage',
    title: 'Phasage Vertex à proposer',
    body:
      "Trois jalons :\n1. Typo et logo — deux semaines\n2. Charte et système de couleur — trois semaines\n3. Déclinaisons et guide d'usage — deux semaines\n\nÀ envoyer à Julien avec le devis révisé à 14 200 €.",
    author: 'me',
    createdAt: daysAgo(5, '18:40'),
    contactId: 'julien',
    conversationId: 'wa-julien',
    mentions: [
      { kind: 'contact', id: 'julien', label: 'Julien Meyer' },
      { kind: 'topic', id: 'vertex', label: 'Refonte de l’identité — Studio Vertex' },
      { kind: 'label', id: 'devis', label: 'Devis' },
    ],
  },
  {
    id: 'note-sarah-dates',
    title: 'Dates Atelier Nord',
    body:
      "Vérifier la compatibilité des trois dates de tournage avec le jalon 2 de Vertex avant de confirmer à Sarah. Risque de chevauchement sur la deuxième semaine.",
    author: 'me',
    createdAt: daysAgo(4, '11:20'),
    contactId: 'sarah',
    conversationId: 'email-atelier-nord',
    mentions: [
      { kind: 'contact', id: 'sarah', label: 'Sarah Nguyen' },
      { kind: 'topic', id: 'atelier-nord', label: 'Production de septembre — Atelier Nord' },
    ],
  },
  {
    id: 'note-libre-accroches',
    title: 'Accroches pour la charte Vertex',
    body:
      "Pistes de signature :\n— « Vertex, l'angle juste »\n— « Construire ce qui tient »\n— « La forme suit la trajectoire »\n\nÀ tester en composition avec l'antique du titrage.",
    author: 'me',
    createdAt: daysAgo(7, '22:05'),
    mentions: [{ kind: 'topic', id: 'vertex', label: 'Refonte de l’identité — Studio Vertex' }],
  },
  {
    id: 'note-libre-relances',
    title: 'À faire cette semaine',
    body:
      "— Relevé de frais pour Élodie (bloquant, dépôt TVA)\n— Confirmer les trois dates à Sarah avant vendredi\n— Répondre à Karim, même pour décliner\n— Gâteau : confirmer 18 parts à Nadia",
    author: 'me',
    createdAt: daysAgo(1, '08:15'),
  },
]
