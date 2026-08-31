/* ============================================================================
   LES RÉCAPS DE L'ASSISTANT

   Quand on demande à Eko « fais-moi un récap » ou « quelles sont mes priorités
   pour le reste de la journée », il répond par un de ces textes, écrits à la
   main. Chaque ligne renvoie à sa conversation.
============================================================================ */

export type BriefKind = 'recent' | 'priorities' | 'day'

export interface BriefItem {
  conversationId: string
  title: string
  detail: string
  /** Ancienneté ou échéance : « il y a 2 h », « avant vendredi » */
  note?: string
}

export interface Brief {
  kind: BriefKind
  heading: string
  intro: string
  items: BriefItem[]
  closing?: string
}

export const briefs: Record<BriefKind, Brief> = {
  recent: {
    kind: 'recent',
    heading: 'Vos derniers messages',
    intro:
      "Six messages sont arrivés depuis ce matin, sur cinq plateformes différentes. Voici ce qu'ils disent, sans les ouvrir.",
    items: [
      {
        conversationId: 'wa-julien',
        title: 'Julien Meyer · WhatsApp',
        detail: "Il vous relance sur la réception du contrat signé, envoyé hier soir par LinkedIn.",
        note: 'il y a quelques minutes',
      },
      {
        conversationId: 'slack-projet-vertex',
        title: '#projet-vertex · Slack',
        detail: "Camille propose de trancher la couleur des boutons cet après-midi ; Thomas attend la valeur définitive.",
        note: 'il y a 35 min',
      },
      {
        conversationId: 'email-atelier-nord',
        title: 'Sarah Nguyen · Gmail',
        detail: "Dernière relance sur les trois dates de tournage : sans réponse, le tournage bascule en octobre.",
        note: 'il y a 2 h',
      },
      {
        conversationId: 'li-karim',
        title: 'Karim Haddad · LinkedIn',
        detail: "Il redemande vingt minutes d'échange sur le poste de lead design, sans engagement.",
        note: 'il y a 4 h',
      },
      {
        conversationId: 'teams-elodie',
        title: 'Élodie Marchand · Teams',
        detail: "Elle demande confirmation : la déclaration de TVA doit partir dans quatre jours.",
        note: 'il y a 8 h',
      },
    ],
    closing: "Trois d'entre eux attendent une réponse de votre part aujourd'hui.",
  },

  priorities: {
    kind: 'priorities',
    heading: 'Vos priorités pour le reste de la journée',
    intro:
      "Trois choses bloquent réellement, et une quatrième vous coûtera cher si elle traîne. Le reste peut attendre demain sans conséquence.",
    items: [
      {
        conversationId: 'teams-elodie',
        title: 'Envoyer le relevé de frais à Élodie',
        detail: "C'est la seule pièce qui manque à la déclaration de TVA, et l'échéance est dans quatre jours.",
        note: 'bloquant',
      },
      {
        conversationId: 'email-atelier-nord',
        title: 'Confirmer les trois dates à Sarah Nguyen',
        detail: "Le studio libère le créneau vendredi. Un oui ou un non lui suffit.",
        note: 'avant vendredi',
      },
      {
        conversationId: 'wa-julien',
        title: 'Accuser réception du contrat Vertex',
        detail: "Julien a relancé il y a quelques minutes. Deux lignes suffisent à le rassurer.",
        note: '2 minutes',
      },
      {
        conversationId: 'slack-projet-vertex',
        title: 'Trancher la couleur des boutons secondaires',
        detail: "Camille et Thomas sont bloqués depuis hier ; Camille propose d'en décider cet après-midi.",
        note: 'cet après-midi',
      },
    ],
    closing: "Karim, Nadia et les références de Camille peuvent attendre demain.",
  },

  day: {
    kind: 'day',
    heading: 'Votre point du jour',
    intro:
      "Le dossier Vertex est signé et passe en exécution, deux clients attendent une réponse simple, et une échéance comptable approche.",
    items: [
      {
        conversationId: 'li-julien',
        title: 'Studio Vertex — contrat signé',
        detail: "Reçu hier soir par LinkedIn. L'exécution démarre, le calendrier de janvier ne supporte aucun retard.",
      },
      {
        conversationId: 'email-atelier-nord',
        title: 'Atelier Nord — trois dates à confirmer',
        detail: "Relancé ce matin par mail puis sur Teams. Décision attendue avant vendredi.",
      },
      {
        conversationId: 'teams-elodie',
        title: 'TVA du trimestre — une pièce manquante',
        detail: "Le relevé de frais de déplacement, promis deux fois, jamais envoyé.",
      },
      {
        conversationId: 'wa-vertex-lancement',
        title: 'Lancement Vertex — arbitrage en attente',
        detail: "Le groupe attend que vous choisissiez qui rédige les textes du site.",
      },
    ],
    closing: 'Quatre décisions, aucune ne demande plus de dix minutes.',
  },
}

/* ---------------------------------------------------------------------------
   CE QUE VOUS AVEZ RATÉ

   La liste, elle, se calcule à partir de l'état réel : non lus et
   conversations qui attendent une réponse. Ce sont les explications qui sont
   écrites à la main — le poids détermine ce qui remonte en tête.
--------------------------------------------------------------------------- */

export interface MissedNote {
  reason: string
  weight: number
}

export const missedNotes: Record<string, MissedNote> = {
  'teams-elodie': {
    reason: "Échéance ferme : la déclaration de TVA doit partir dans quatre jours et il manque une seule pièce.",
    weight: 10,
  },
  'email-atelier-nord': {
    reason: "Le studio libère le créneau vendredi. Sans un oui ou un non, le tournage bascule en octobre.",
    weight: 9,
  },
  'wa-julien': {
    reason: "Contrat signé, trois demandes en attente dans son vocal, et un rendez-vous proposé sans réponse.",
    weight: 8,
  },
  'teams-sarah': {
    reason: "Même sujet que son mail, mais sur Teams : elle attend une confirmation ferme.",
    weight: 7,
  },
  'li-karim': {
    reason: "Relancé deux fois. Même un refus poli vaut mieux que le silence.",
    weight: 6,
  },
  'slack-projet-vertex': {
    reason: "Deux personnes sont bloquées tant que la couleur des boutons n'est pas tranchée.",
    weight: 6,
  },
  'wa-vertex-lancement': {
    reason: "Le groupe attend votre arbitrage sur qui rédige les textes du site.",
    weight: 5,
  },
  'wa-camille': {
    reason: "Elle travaille dessus demain matin : la réponse est attendue ce soir.",
    weight: 5,
  },
  'li-julien': {
    reason: "Le contrat signé est arrivé ici, sans accusé de réception de votre part.",
    weight: 4,
  },
  'wa-thomas': {
    reason: "Il bloque sa journée de lundi si vous confirmez le décalage.",
    weight: 4,
  },
  'ig-julien': {
    reason: "Il vous demande un avis de professionnel sur une typo, sans urgence.",
    weight: 2,
  },
  'wa-nadia': {
    reason: "Le gâteau et votre heure d'arrivée, à confirmer avant vendredi.",
    weight: 2,
  },
}
