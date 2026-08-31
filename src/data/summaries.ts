import type { CrossChannelSummary } from '../types'

/* ============================================================================
   RÉSUMÉ TRANSVERSAL D'UN CONTACT

   Affiché sur la fiche d'une personne. Le point sur un sujet, lui, se demande
   à l'assistant : voir src/data/dossiers.ts.
============================================================================ */


/* ---------------------------------------------------------------------------
   RÉSUMÉ TRANSVERSAL — « où on en est avec Julien ? »
   Il mêle les trois canaux et indique la source de chaque élément.
--------------------------------------------------------------------------- */

export const crossChannelSummaries: CrossChannelSummary[] = [
  {
    contactId: 'julien',
    question: 'Où on en est avec Julien ?',
    intro:
      "Le dossier Studio Vertex est passé par trois canaux en trois semaines. Voici la chronologie reconstituée, tous canaux confondus.",
    items: [
      {
        platform: 'email',
        date: 'il y a 21 jours',
        text: 'Julien demande un devis pour la refonte complète de l’identité de Studio Vertex.',
      },
      {
        platform: 'email',
        date: 'il y a 19 jours',
        text: 'Vous envoyez Devis_Vertex_identite_v1.pdf, décomposé par lot, valable trente jours.',
      },
      {
        platform: 'whatsapp',
        date: 'il y a 13 jours',
        text: 'Il annonce que le comité valide le principe et bascule la discussion ici.',
      },
      {
        platform: 'whatsapp',
        date: 'il y a 6 jours',
        text: 'Vocal de 1 min 40 : montant arbitré à 14 200 €, démarrage décalé, phasage en trois temps demandé.',
      },
      {
        platform: 'whatsapp',
        date: 'il y a 2 jours',
        text: 'Il propose un point mardi 14h, toujours sans réponse de votre part.',
      },
      {
        platform: 'linkedin',
        date: 'hier soir',
        text: 'Contrat_Vertex_signe.pdf arrive en pièce jointe, la boîte mail de Vertex étant saturée.',
      },
    ],
    conclusion:
      "En résumé : l’affaire est signée, mais trois choses vous attendent — accuser réception du contrat, répondre aux trois demandes du vocal, et trancher le rendez-vous de mardi.",
  },
]

export function getCrossChannelSummary(contactId: string): CrossChannelSummary | undefined {
  return crossChannelSummaries.find((summary) => summary.contactId === contactId)
}
