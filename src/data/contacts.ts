import type { Contact } from '../types'

/* ============================================================================
   CONTACTS

   Chaque contact est présent sur au moins deux plateformes : c'est ce qui
   permet à Eko de démontrer l'Interconnexion.
============================================================================ */

export const contacts: Contact[] = [
  {
    id: 'julien',
    photo: 1,
    fullName: 'Julien Meyer',
    role: 'Fondateur',
    company: 'Studio Vertex',
    handles: [
      { platform: 'email', handle: 'julien.meyer@studiovertex.fr' },
      { platform: 'whatsapp', handle: '+33 6 21 44 90 17' },
      { platform: 'linkedin', handle: 'Julien Meyer · Studio Vertex' },
      { platform: 'instagram', handle: '@julien.vertex' },
    ],
    ekoSummary:
      "Client depuis trois semaines. Il vous a demandé un devis pour la refonte de l'identité de Studio Vertex, puis a relancé sur WhatsApp avant de renvoyer le contrat signé par LinkedIn. Budget validé à 14 200 €, démarrage calé début du mois prochain. Il écrit court, répond vite, et préfère le vocal au téléphone.",
  },
  {
    id: 'sarah',
    photo: 2,
    fullName: 'Sarah Nguyen',
    role: 'Cheffe de projet',
    company: 'Atelier Nord',
    handles: [
      { platform: 'email', handle: 's.nguyen@ateliernord.com' },
      { platform: 'slack', handle: '@sarah' },
      { platform: 'teams', handle: 's.nguyen@ateliernord.com' },
    ],
    ekoSummary:
      "Votre interlocutrice principale chez Atelier Nord depuis deux ans. Elle pilote le planning de production de septembre et vous a relancé ce matin par mail puis sur Teams sur les jalons. Très structurée : elle récapitule toujours par écrit après un appel.",
  },
  {
    id: 'camille',
    photo: 0,
    fullName: 'Camille Rousseau',
    role: 'Directrice artistique indépendante',
    handles: [
      { platform: 'whatsapp', handle: '+33 6 78 12 05 44' },
      { platform: 'slack', handle: '@camille' },
      { platform: 'instagram', handle: '@camille.rsx' },
    ],
    ekoSummary:
      "Collaboratrice régulière, mobilisée sur le projet Vertex. Vous échangez sur Slack pour le travail, sur WhatsApp pour l'organisation et sur Instagram pour les références visuelles. Disponible à partir de la semaine prochaine, elle attend votre retour sur la piste typographique.",
  },
  {
    id: 'thomas',
    photo: 5,
    fullName: 'Thomas Lefèvre',
    role: 'Développeur front-end',
    handles: [
      { platform: 'slack', handle: '@thomas' },
      { platform: 'whatsapp', handle: '+33 7 61 33 28 90' },
      { platform: 'teams', handle: 'thomas.lefevre@studio-nova.fr' },
    ],
    ekoSummary:
      "Il intègre les maquettes du projet Vertex. Réactif sur Slack en journée, joignable sur Teams en cas d'urgence. La mise en préproduction est faite ; il attend les contenus définitifs pour finaliser.",
  },
  {
    id: 'nadia',
    photo: 0,
    fullName: 'Nadia Benali',
    role: 'Amie',
    handles: [
      { platform: 'whatsapp', handle: '+33 6 09 55 71 23' },
      { platform: 'instagram', handle: '@nadia.bnl' },
    ],
    ekoSummary:
      "Amie de longue date. Vous organisez ensemble l'anniversaire surprise de Marc le mois prochain : vous avez pris le gâteau en charge, elle s'occupe du lieu. Rien d'urgent, mais deux messages attendent une réponse.",
  },
  {
    id: 'karim',
    photo: 3,
    fullName: 'Karim Haddad',
    role: 'Responsable recrutement',
    company: 'Vaultis',
    handles: [
      { platform: 'linkedin', handle: 'Karim Haddad · Vaultis' },
      { platform: 'email', handle: 'k.haddad@vaultis.io' },
    ],
    ekoSummary:
      "Recruteur chez Vaultis. Il vous a approché sur LinkedIn pour un poste de lead design, puis a basculé sur l'e-mail pour envoyer la fiche de poste et une proposition d'entretien. Vous n'êtes pas en recherche active ; sa dernière relance date de ce matin.",
  },
  {
    id: 'elodie',
    photo: 4,
    fullName: 'Élodie Marchand',
    role: 'Expert-comptable',
    company: 'Cabinet Beaumont',
    handles: [
      { platform: 'email', handle: 'e.marchand@beaumont-associes.fr' },
      { platform: 'teams', handle: 'e.marchand@beaumont-associes.fr' },
    ],
    ekoSummary:
      "Votre comptable. Elle réclame deux justificatifs pour la déclaration de TVA du trimestre et vous a relancé sur Teams après son e-mail resté sans réponse. Échéance de dépôt dans quatre jours.",
  },
]

export function getContact(id: string | undefined): Contact | undefined {
  return contacts.find((contact) => contact.id === id)
}
