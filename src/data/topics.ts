import type { Topic } from '../types'

/* ============================================================================
   SUJETS

   Un sujet regroupe des échanges qui portent sur la même affaire, quelles que
   soient les plateformes et les personnes. C'est le sujet qui fait le lien :
   deux messages d'une même personne sur deux affaires différentes ne sont
   jamais rapprochés.

   Exemple volontaire : Sarah Nguyen apparaît dans le sujet « Studio Vertex »
   et dans le sujet « Atelier Nord ». Les deux ne se mélangent pas.

   👉 POUR AJOUTER UN SUJET : une entrée ici, puis `topicId` sur les
      conversations concernées dans conversations.ts.
============================================================================ */

export const topics: Topic[] = [
  {
    id: 'vertex',
    name: 'Refonte de l’identité — Studio Vertex',
    tagline: 'Du devis au contrat signé, sur cinq canaux',
    miniSummary:
      "Le contrat est signé et l'exécution démarre, mais trois décisions vous attendent : accuser réception à Julien, trancher qui rédige les textes du site, et donner la couleur définitive à Thomas. Le calendrier de janvier ne supporte aucun retard.",
    context:
      "Studio Vertex vous a confié la refonte complète de son identité visuelle. L'affaire a commencé par un e-mail il y a trois semaines et s'est déplacée sur WhatsApp, LinkedIn, Slack et Instagram au fil des étapes. Le contrat est signé ; l'exécution démarre.",
    keyPoints: [
      'Devis envoyé par Gmail, puis arbitré à 14 200 € lors du vocal de Julien sur WhatsApp.',
      'Contrat signé reçu par LinkedIn hier soir, la boîte mail de Vertex étant saturée.',
      'Julien propose un point mardi 14h, toujours sans réponse.',
      'Côté équipe, la piste typographique n°3 est retenue et la préproduction est en ligne.',
      'Deux contrastes sous le niveau AA bloquent Thomas, qui attend la couleur définitive.',
      'Le groupe de lancement attend votre arbitrage sur qui rédige les textes du site.',
    ],
    expectedFromYou: [
      'Accuser réception du contrat signé auprès de Julien.',
      'Trancher entre Atelier Nord et une rédactrice externe pour les textes.',
      'Donner la couleur définitive des boutons secondaires à Thomas.',
      'Confirmer ou décliner le rendez-vous de mardi 14h.',
    ],
  },
  {
    id: 'atelier-nord',
    name: 'Production de septembre — Atelier Nord',
    tagline: 'Un dossier distinct, avec la même interlocutrice',
    miniSummary:
      "Sarah attend depuis ce matin la confirmation de trois dates de tournage, par mail puis sur Teams. Le studio libère le créneau vendredi si vous ne répondez pas.",
    context:
      "Sarah Nguyen pilote pour Atelier Nord un planning de production sans rapport avec le projet Vertex. Le tournage est calé sur la semaine du 15, mais trois dates attendent votre confirmation depuis trois jours.",
    keyPoints: [
      'Semaine du 15 retenue d’un commun accord.',
      'Planning consolidé reçu il y a 12 jours en pièce jointe.',
      'Trois relances successives, la dernière ce matin — et un message Teams de Sarah dans la foulée.',
      'Sans réponse avant vendredi, le tournage bascule en octobre et le studio libère le créneau.',
    ],
    expectedFromYou: [
      'Confirmer les trois dates surlignées du planning.',
      'Répondre avant vendredi, date limite annoncée par l’équipe technique.',
    ],
  },
  {
    id: 'tva',
    name: 'Déclaration de TVA du trimestre',
    tagline: 'Une pièce manquante, deux canaux',
    miniSummary:
      "Il manque une seule pièce à votre comptable — le relevé de frais de déplacement — et la déclaration doit partir dans quatre jours. Vous vous êtes engagé deux fois sans suite.",
    context:
      "Votre expert-comptable prépare la déclaration de TVA. Elle a d'abord écrit par Gmail il y a seize jours, puis a basculé sur Teams faute de réponse. Une seule pièce manque encore.",
    keyPoints: [
      'La facture d’impression de juin a bien été transmise.',
      'Le relevé de frais de déplacement n’a jamais été envoyé.',
      'Deux engagements de votre part non tenus.',
      'La déclaration doit partir dans quatre jours.',
    ],
    expectedFromYou: ['Envoyer le relevé de frais de déplacement, ou annoncer une date ferme.'],
  },
  {
    id: 'recrutement',
    name: 'Poste de lead design — Vaultis',
    tagline: 'Une approche menée sur deux canaux',
    miniSummary:
      "Karim relance ce matin pour un simple échange de vingt minutes. Vous n'êtes pas en recherche, mais sa proposition reste ouverte jusqu'à la fin du mois.",
    context:
      "Karim Haddad vous approche depuis deux semaines pour un poste de lead design chez Vaultis. L'échange a commencé sur LinkedIn puis s'est prolongé par e-mail avec la fiche de poste.",
    keyPoints: [
      'Vous avez indiqué ne pas être en recherche active.',
      'Équipe de six personnes, poste rattaché à la direction produit.',
      'Rythme de quatre jours envisageable après la période d’essai.',
      'Candidatures closes à la fin du mois ; sa dernière relance date de ce matin.',
    ],
    expectedFromYou: ['Répondre à la relance du 5ᵉ jour, même pour décliner.'],
  },
  {
    id: 'anniversaire',
    name: 'Anniversaire surprise de Marc',
    tagline: 'Trois conversations, une seule fête',
    miniSummary:
      "Tout est calé pour samedi 12 chez Léa. Il ne manque que votre confirmation sur le nombre de parts du gâteau et sur votre heure d'arrivée.",
    context:
      "L'organisation des 30 ans de Marc, menée avec Nadia sur WhatsApp, complétée sur Instagram pour le lieu, et coordonnée dans un groupe avec Léa et Hugo. Tout est calé sauf deux points, les vôtres.",
    keyPoints: [
      'Samedi 12 chez Léa, arrivée des invités à 19h30, Marc arrive à 20h.',
      'Effectif final : 15 personnes.',
      'Vous avez pris le gâteau en charge ; Hugo les boissons, Léa la maison.',
      'La déco reste à acheter, Léa se propose pour samedi matin.',
    ],
    expectedFromYou: [
      'Confirmer le gâteau pour 15 à 18 parts.',
      'Dire si vous arrivez à 19h30 ou plus tard.',
    ],
  },
  {
    id: 'integration',
    name: 'Intégration du site',
    tagline: 'Slack en journée, Teams en urgence',
    miniSummary:
      "La préproduction est en ligne et Thomas propose de décaler la mise en production à lundi. Il attend vos contenus définitifs pour la page équipe.",
    context:
      "Thomas Lefèvre intègre les maquettes. Les échanges passent par Slack en temps normal et sur Teams quand Slack tombe. La préproduction est en ligne.",
    keyPoints: [
      'Icônes livrées en fichiers séparés, police en woff2 avec repli système.',
      'Un incident de build a été réglé le jour même sur Teams.',
      'Préproduction déployée il y a 3 jours, penser à vider le cache.',
    ],
    expectedFromYou: [
      'Envoyer les contenus définitifs de la page équipe.',
      'Tester la préproduction et faire un retour.',
    ],
  },
]

export function getTopic(id: string | undefined): Topic | undefined {
  return topics.find((topic) => topic.id === id)
}
