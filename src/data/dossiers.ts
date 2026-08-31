import type { PlatformId } from '../config/platforms'

/* ============================================================================
   LES DOSSIERS

   Ce qu'Eko répond quand on lui demande où en est un projet, un client ou un
   sujet. Chaque dossier est un texte long, écrit à la main, qui recoud ce qui
   s'est dit sur toutes les plateformes en une seule lecture continue.

   👉 POUR AJOUTER UN DOSSIER : une entrée ici, avec les mots qui le
      déclenchent et les paragraphes de la réponse.
============================================================================ */

export interface DossierPoint {
  text: string
  /** La plateforme d'où vient l'information */
  platform?: PlatformId
  /** La conversation à ouvrir au clic */
  conversationId?: string
  /** Quand c'est arrivé : « il y a 6 jours » */
  when?: string
}

export interface DossierSection {
  heading: string
  paragraphs?: string[]
  points?: DossierPoint[]
}

export interface Dossier {
  id: string
  /** Sujet correspondant, pour lister les conversations rattachées */
  topicId: string
  /** Mots qui désignent ce dossier : nom du projet, du client, du sujet */
  keywords: string[]
  title: string
  opening: string
  sections: DossierSection[]
  closing: string
}

export const dossiers: Dossier[] = [
  {
    id: 'vertex',
    topicId: 'vertex',
    keywords: ['vertex', 'studio vertex', 'julien', 'meyer', 'identite', 'refonte', 'devis', 'contrat', 'logo', 'charte'],
    title: 'Refonte de l’identité — Studio Vertex',
    opening:
      "Le dossier Vertex est votre affaire la plus avancée du moment : signée, chiffrée, et désormais en phase d’exécution. Elle s’est construite sur quatre plateformes en trois semaines, ce qui explique qu’aucune conversation ne suffise à elle seule pour comprendre où vous en êtes. Voici l’histoire complète, remise dans l’ordre.",
    sections: [
      {
        heading: 'Comment l’affaire s’est nouée',
        paragraphs: [
          "Tout commence il y a trois semaines par un e-mail de Julien Meyer, fondateur de Studio Vertex : refonte complète de l’identité visuelle — logo, système typographique, charte et déclinaisons — pour une mise en ligne à la rentrée de janvier. Vous répondez le jour même avec trois questions de cadrage ; il annonce une enveloppe autour de 15 000 € HT et confirme qu’on repart de zéro, seul le nom étant conservé.",
          "Le devis part deux jours plus tard, décomposé par lot. Julien le soumet à son comité, puis la conversation quitte l’e-mail : il bascule sur WhatsApp, « plus simple que le mail », et c’est là que tout se joue ensuite.",
        ],
        points: [
          {
            text: 'Demande de devis initiale, avec le périmètre et la date de mise en ligne',
            platform: 'email',
            conversationId: 'email-vertex-devis',
            when: 'il y a 21 jours',
          },
          {
            text: 'Devis_Vertex_identite_v1.pdf envoyé, valable trente jours',
            platform: 'email',
            conversationId: 'email-vertex-devis',
            when: 'il y a 19 jours',
          },
        ],
      },
      {
        heading: 'Le vocal qui a tout arbitré',
        paragraphs: [
          "Le point le plus important du dossier n’est pas écrit : c’est un message vocal d’une minute quarante, laissé par Julien sur WhatsApp il y a six jours. Il y valide le devis, mais à 14 200 € après arbitrage sur le lot 4 — et non les 15 000 € annoncés. Il demande aussi deux choses qui changent le planning : décaler le démarrage au début du mois prochain, le temps de boucler leur saison, et refaire un phasage en trois temps avec un premier jalon portant uniquement sur la typographie et le logo, pour rassurer son comité.",
          "Troisième point, plus discret mais contractuel : il veut les déclinaisons réseaux sociaux dans le lot, pas en option. Vous aviez déjà confirmé ce point par e-mail il y a seize jours — la cohérence est donc assurée, mais elle mérite d’être rappelée dans le devis révisé.",
        ],
        points: [
          {
            text: 'Vocal de 1 min 40 : montant, décalage du démarrage, phasage en trois jalons',
            platform: 'whatsapp',
            conversationId: 'wa-julien',
            when: 'il y a 6 jours',
          },
        ],
      },
      {
        heading: 'La signature, arrivée là où on ne l’attendait pas',
        paragraphs: [
          "Le contrat signé n’est arrivé ni par e-mail ni sur WhatsApp, mais par LinkedIn hier soir à 19h12 — la boîte mail de Studio Vertex étant saturée. C’est exactement le genre de document qu’on perd quand on travaille en applications séparées : la demande est partie d’un canal, la réponse est revenue par un autre.",
          "Julien vous a relancé depuis, sur WhatsApp cette fois, pour savoir si vous l’aviez bien reçu. Cette relance date de quelques minutes et reste sans réponse.",
        ],
        points: [
          {
            text: 'Contrat_Vertex_signe.pdf reçu en pièce jointe',
            platform: 'linkedin',
            conversationId: 'li-julien',
            when: 'hier soir',
          },
          {
            text: '« Tu l’as bien reçu ? » — la relance est encore sans réponse',
            platform: 'whatsapp',
            conversationId: 'wa-julien',
            when: 'il y a quelques minutes',
          },
        ],
      },
      {
        heading: 'Où en est la production',
        paragraphs: [
          "Côté équipe, le travail a démarré sans attendre la signature. Camille Rousseau a proposé trois pistes typographiques sur le canal Slack du projet ; la troisième — titrage antique, texte grotesque — a été retenue parce qu’elle tient mieux en déclinaison. Thomas Lefèvre a calé une grille 12 colonnes avec gouttière 24 et déployé la préproduction il y a trois jours.",
          "Deux points bloquent aujourd’hui. Le premier est technique : deux contrastes passent sous le niveau AA sur les boutons secondaires, et Thomas attend la couleur définitive pour corriger. Camille propose d’en décider cet après-midi. Le second est organisationnel : dans le groupe de lancement, personne n’a tranché qui rédige les textes du site — Atelier Nord en facturation séparée, ou une rédactrice externe que Camille connaît. Julien valide le budget mais laisse le choix à l’équipe, et la maquette est bloquée tant que rien n’est décidé.",
        ],
        points: [
          {
            text: 'Piste typographique n°3 retenue, préproduction en ligne',
            platform: 'slack',
            conversationId: 'slack-projet-vertex',
            when: 'il y a 3 jours',
          },
          {
            text: 'Arbitrage attendu sur la rédaction des textes du site',
            platform: 'whatsapp',
            conversationId: 'wa-vertex-lancement',
            when: 'il y a 13 heures',
          },
          {
            text: 'Camille demande si elle garde la couleur d’accent actuelle',
            platform: 'whatsapp',
            conversationId: 'wa-camille',
            when: 'hier soir',
          },
        ],
      },
      {
        heading: 'Le calendrier, et sa marge',
        paragraphs: [
          "La mise en ligne reste calée sur la rentrée de janvier. Camille livre la charte pour mi-décembre, la production demande trois semaines après : on tombe début janvier. C’est tenable, mais sans aucune marge — un seul jalon décalé et la date saute. C’est la raison pour laquelle les deux arbitrages en attente comptent plus que leur apparence.",
        ],
      },
    ],
    closing:
      "En résumé : l’affaire est gagnée et le cadre est clair, mais quatre décisions vous appartiennent — accuser réception du contrat auprès de Julien, confirmer le rendez-vous qu’il propose, donner la couleur définitive à Thomas, et trancher qui rédige les textes. Aucune ne demande plus de dix minutes ; toutes retardent le projet tant qu’elles ne sont pas prises.",
  },

  {
    id: 'atelier-nord',
    topicId: 'atelier-nord',
    keywords: ['atelier nord', 'sarah', 'nguyen', 'production', 'tournage', 'planning', 'studio'],
    title: 'Production de septembre — Atelier Nord',
    opening:
      "Attention à ne pas confondre : Sarah Nguyen apparaît aussi dans le dossier Vertex, mais ce dossier-ci n’a rien à voir. Il s’agit du planning de production de septembre pour Atelier Nord, et il est en train de se dégrader faute de réponse de votre part.",
    sections: [
      {
        heading: 'Ce qui a été convenu',
        paragraphs: [
          "Sarah vous proposait deux fenêtres de tournage : la semaine du 8 ou celle du 15. Vous avez retenu la semaine du 15, qui laisse une semaine de marge après la validation des maquettes, et elle a réservé auprès de l’équipe technique dans la foulée. Le planning consolidé, avec jalons et responsables, vous est parvenu il y a douze jours en pièce jointe.",
        ],
        points: [
          {
            text: 'Planning_production_septembre.pdf, avec trois dates à confirmer',
            platform: 'email',
            conversationId: 'email-atelier-nord',
            when: 'il y a 12 jours',
          },
        ],
      },
      {
        heading: 'Ce qui coince',
        paragraphs: [
          "Depuis, trois relances. La dernière, ce matin, annonce clairement la conséquence : sans retour de votre part, le tournage bascule en octobre. Et Sarah a fait ce que font les gens quand un canal ne répond plus — elle a changé de canal. Elle vous a écrit sur Teams, plus direct, pour dire que le studio ne garderait pas le créneau au-delà de vendredi, puis a proposé de vous appeler demain 11h si c’est plus simple.",
          "Les deux fils disent la même chose et attendent la même réponse : un oui ou un non sur trois dates.",
        ],
        points: [
          {
            text: 'Dernière relance par e-mail : le tournage bascule en octobre sans réponse',
            platform: 'email',
            conversationId: 'email-atelier-nord',
            when: 'ce matin',
          },
          {
            text: '« Un simple oui ou non me suffit » — puis une proposition d’appel demain 11h',
            platform: 'teams',
            conversationId: 'teams-sarah',
            when: 'il y a 9 heures',
          },
        ],
      },
    ],
    closing:
      "Ce dossier ne demande aucun travail, seulement une décision : confirmer les trois dates surlignées avant vendredi. C’est le meilleur rapport entre le temps que ça vous coûte et ce que ça débloque.",
  },

  {
    id: 'tva',
    topicId: 'tva',
    keywords: ['tva', 'comptable', 'comptabilite', 'elodie', 'marchand', 'declaration', 'beaumont', 'releve', 'frais'],
    title: 'Déclaration de TVA du trimestre',
    opening:
      "Un dossier simple sur le fond, devenu urgent par accumulation : il manque une seule pièce à votre expert-comptable depuis seize jours, et l’échéance de dépôt tombe dans quatre jours.",
    sections: [
      {
        heading: 'Ce qui manque',
        paragraphs: [
          "Élodie Marchand vous a demandé deux justificatifs pour la déclaration : la facture du prestataire d’impression de juin, et le relevé de frais de déplacement. La facture d’impression est partie il y a treize jours. Le relevé de frais, lui, n’a jamais été envoyé — malgré deux engagements de votre part, l’un il y a seize jours, l’autre il y a neuf jours.",
        ],
        points: [
          {
            text: 'Demande initiale des deux justificatifs',
            platform: 'email',
            conversationId: 'email-elodie',
            when: 'il y a 16 jours',
          },
          {
            text: 'Facture_impression_juin.pdf transmise — il ne manque plus que le relevé',
            platform: 'email',
            conversationId: 'email-elodie',
            when: 'il y a 13 jours',
          },
        ],
      },
      {
        heading: 'L’escalade',
        paragraphs: [
          "Comme souvent, le silence a fait changer de canal. Élodie a basculé sur Teams il y a cinq jours, où le ton est plus direct : elle demande une confirmation, rappelle l’échéance, et vous relance ce matin encore. Vous avez répondu deux fois « ça arrive », sans suite.",
          "Elle a été explicite sur la conséquence : sans cette pièce, elle ne peut pas déposer la déclaration dans les temps.",
        ],
        points: [
          {
            text: '« La déclaration doit partir dans quatre jours. Pouvez-vous me confirmer ? »',
            platform: 'teams',
            conversationId: 'teams-elodie',
            when: 'ce matin',
          },
        ],
      },
    ],
    closing:
      "C’est le seul dossier de votre liste avec une échéance ferme et une conséquence administrative. Envoyez le relevé, ou annoncez une date précise — l’un ou l’autre, mais aujourd’hui.",
  },

  {
    id: 'recrutement',
    topicId: 'recrutement',
    keywords: ['vaultis', 'karim', 'haddad', 'recrutement', 'poste', 'lead design', 'emploi', 'job'],
    title: 'Poste de lead design — Vaultis',
    opening:
      "Une approche menée avec méthode par Karim Haddad depuis deux semaines, sur deux canaux, et à laquelle vous n’avez pas encore donné de réponse claire.",
    sections: [
      {
        heading: 'Le déroulé',
        paragraphs: [
          "Karim vous contacte d’abord sur LinkedIn pour un poste de lead design à Paris. Vous répondez honnêtement : pas en recherche active, mais curieux. Il propose alors de vous envoyer la fiche de poste « à toutes fins utiles », et vous l’orientez vers votre adresse professionnelle — c’est ainsi que le dossier passe sur Gmail.",
          "La fiche est arrivée avec des précisions utiles : une équipe de six personnes, un rattachement à la direction produit, et un rythme de quatre jours envisageable après la période d’essai, sous réserve de validation. Les candidatures closent à la fin du mois.",
        ],
        points: [
          {
            text: 'Approche initiale et échange sur votre disponibilité',
            platform: 'linkedin',
            conversationId: 'li-karim',
            when: 'il y a 14 jours',
          },
          {
            text: 'Fiche_poste_lead_design_Vaultis.pdf et conditions détaillées',
            platform: 'email',
            conversationId: 'email-karim',
            when: 'il y a 13 jours',
          },
        ],
      },
      {
        heading: 'Là où ça en est',
        paragraphs: [
          "Deux relances depuis, la dernière ce matin sur LinkedIn : il demande vingt minutes d’échange, sans engagement. Rien ne vous oblige à donner suite, mais le silence commence à être la seule réponse que vous lui donnez, alors qu’il a été irréprochable dans sa façon de procéder.",
        ],
        points: [
          {
            text: '« Un échange de vingt minutes suffirait à se faire une idée »',
            platform: 'linkedin',
            conversationId: 'li-karim',
            when: 'ce matin',
          },
        ],
      },
    ],
    closing:
      "Deux issues possibles, toutes deux honorables : accepter vingt minutes sans engagement, ou décliner poliment en laissant la porte ouverte. La troisième — ne rien dire jusqu’à la fin du mois — est la seule qui vous coûte quelque chose.",
  },

  {
    id: 'integration',
    topicId: 'integration',
    keywords: ['integration', 'thomas', 'lefevre', 'site', 'preprod', 'preproduction', 'deploiement', 'technique'],
    title: 'Intégration du site',
    opening:
      "Un dossier sain, mené par Thomas Lefèvre, où presque tout est livré. Deux choses seulement attendent quelque chose de vous, et l’une porte une date.",
    sections: [
      {
        heading: 'Ce qui est fait',
        paragraphs: [
          "Les icônes sont livrées en fichiers séparés, la police est chargée en woff2 avec un repli système, et la préproduction est déployée depuis trois jours — avec un rappel de vider le cache avant de tester. Un incident de build lié aux polices a été réglé le jour même, en basculant sur Teams pendant une panne de Slack : moins d’une heure entre le signalement et la correction.",
        ],
        points: [
          {
            text: 'Préproduction en ligne, lien épinglé dans le canal',
            platform: 'slack',
            conversationId: 'slack-thomas',
            when: 'il y a 3 jours',
          },
        ],
      },
      {
        heading: 'Ce qu’il attend',
        paragraphs: [
          "D’abord les contenus définitifs de la page équipe, qu’il vous a rappelés il y a deux jours sur Teams. Ensuite une confirmation sur le calendrier : il propose de décaler la mise en production à lundi 10h plutôt que vendredi, pour ne pas déployer avant un week-end sans personne d’astreinte. L’argument est solide, et il bloque sa journée de lundi si vous validez.",
        ],
        points: [
          {
            text: 'Les contenus définitifs de la page équipe manquent toujours',
            platform: 'teams',
            conversationId: 'teams-thomas',
            when: 'il y a 2 jours',
          },
          {
            text: '« Lundi 10h, on a la journée devant nous » — en attente de votre accord',
            platform: 'whatsapp',
            conversationId: 'wa-thomas',
            when: 'il y a 11 heures',
          },
        ],
      },
    ],
    closing:
      "Rien d’urgent au sens strict, mais deux réponses courtes suffiraient à libérer complètement son planning de la semaine.",
  },

  {
    id: 'anniversaire',
    topicId: 'anniversaire',
    keywords: ['anniversaire', 'marc', 'nadia', 'benali', 'surprise', 'gateau', 'fete', 'lea', 'hugo'],
    title: 'Anniversaire surprise de Marc',
    opening:
      "Le seul dossier personnel de votre liste, et il est presque bouclé — mais deux détails vous appartiennent, et ils bloquent la commande de quelqu’un d’autre.",
    sections: [
      {
        heading: 'L’organisation',
        paragraphs: [
          "Rendez-vous samedi 12 chez Léa, arrivée des invités à 19h30, Marc arrive à 20h — sa sœur se charge de le faire venir sans qu’il se doute de rien. Quinze personnes au total. Hugo apporte les boissons et la playlist, Léa ouvre la maison, vous avez pris le gâteau en charge.",
          "Le lieu a d’ailleurs failli être ailleurs : Nadia avait repéré un endroit sur Instagram, écarté parce que trop petit pour quinze.",
        ],
        points: [
          {
            text: 'Répartition des rôles et date arrêtée',
            platform: 'whatsapp',
            conversationId: 'wa-nadia',
            when: 'il y a 20 jours',
          },
          {
            text: 'Le lieu envisagé sur Instagram, finalement écarté',
            platform: 'instagram',
            conversationId: 'ig-nadia',
            when: 'il y a 14 jours',
          },
        ],
      },
      {
        heading: 'Ce qui reste',
        paragraphs: [
          "Nadia attend deux confirmations avant vendredi : le nombre de parts du gâteau — quinze à dix-huit selon l’effectif final — et si vous venez accompagné. Il reste aussi la déco à acheter, mais Léa s’est proposée pour samedi matin, donc ce point est couvert.",
        ],
        points: [
          {
            text: 'Confirmation attendue sur les parts et sur votre venue',
            platform: 'whatsapp',
            conversationId: 'wa-nadia',
            when: 'hier soir',
          },
        ],
      },
    ],
    closing:
      "Deux minutes de réponse, et Nadia peut commander. C’est le dossier le moins lourd de votre journée, et probablement celui qui fera le plus plaisir.",
  },
]

/** Mots qui indiquent qu'on demande un point sur un sujet, pas une recherche. */
export const DOSSIER_QUESTION_CUES = [
  'ou en est',
  'ou on en est',
  'ou j en suis avec',
  'fais le point sur',
  'fait le point sur',
  'point sur',
  'resume',
  'resume moi',
  'raconte',
  'raconte moi',
  'explique',
  'explique moi',
  'parle moi de',
  'dis moi tout',
  'avancee',
  'avancement',
  'etat du dossier',
  'le dossier',
  'situation',
  'qu est ce qui s est passe',
  'ca en est ou',
  'quoi de neuf sur',
  'tout savoir sur',
]

export function findDossier(text: string): Dossier | null {
  const asksForPoint = DOSSIER_QUESTION_CUES.some((cue) => text.includes(cue))
  if (!asksForPoint) return null

  return dossiers.find((dossier) => dossier.keywords.some((keyword) => text.includes(keyword))) ?? null
}
