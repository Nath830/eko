import type { SuggestedReply, SuggestedReplySet } from '../types'

/* ============================================================================
   RÉPONSES PRÉ-FAITES

   Deux séries par conversation : la seconde sort au clic sur « Régénérer ».
   Le ton suit la plateforme — court et direct sur WhatsApp et Instagram,
   structuré et vouvoyé sur Gmail et LinkedIn.

   Chaque brouillon porte une intention : accepter, demander un délai,
   poser une question, ou décliner poliment.
============================================================================ */

const accepter = (text: string): SuggestedReply => ({ intent: 'accepter', label: 'Accepter', text })
const delai = (text: string): SuggestedReply => ({ intent: 'delai', label: 'Demander un délai', text })
const question = (text: string): SuggestedReply => ({ intent: 'question', label: 'Poser une question', text })
const decliner = (text: string): SuggestedReply => ({ intent: 'decliner', label: 'Décliner poliment', text })

export const replySets: SuggestedReplySet[] = [
  {
    conversationId: 'wa-vertex-lancement',
    series: [
      [
        accepter(
          "On part sur la rédactrice externe de Camille 👍 Camille, tu nous la présentes cette semaine ? Julien, je te fais chiffrer le poste d'ici vendredi. Et je confirme : charte mi-décembre, c'est tenable.",
        ),
        question(
          "Avant de trancher : Sarah, ça représente combien de jours côté Atelier Nord ? Et Camille, ta rédactrice est dispo en décembre ? Je décide dès que j'ai les deux réponses.",
        ),
        delai(
          "Je tranche demain matin, promis. Camille, prépare-moi juste un mot sur ta rédactrice pour que je compare avec l'option Atelier Nord.",
        ),
      ],
      [
        accepter(
          "Décision : Atelier Nord prend les textes, en ligne séparée du devis. Sarah, tu peux me faire un chiffrage ? Ça évite d'ajouter un intervenant de plus dans la boucle.",
        ),
        question("On a besoin de combien de pages rédigées au juste ? Ça change complètement l'arbitrage."),
      ],
    ],
  },
  {
    conversationId: 'wa-julien',
    series: [
      [
        accepter(
          "Oui, bien reçu le contrat, merci ! Je valide les 14 200 € et le démarrage début du mois prochain. Je te renvoie un phasage en trois temps demain, avec la typo et le logo en premier jalon. Et c'est ok pour mardi 14h 👍",
        ),
        delai(
          "Reçu le contrat, merci ! Je te fais un retour complet sur le vocal en début de semaine prochaine, le temps de reprendre le phasage proprement. Mardi 14h, ça me va.",
        ),
        question(
          "Contrat bien reçu 👍 Deux questions avant que je reprenne le devis : les 14 200 €, c'est bien avec les déclinaisons réseaux dedans ? Et le premier jalon, tu le veux livré avant ou après votre saison ?",
        ),
      ],
      [
        accepter(
          "C'est bon, j'ai le contrat 🙌 Tout est validé de mon côté : montant, décalage, phasage en trois temps. Je te propose qu'on cale le détail mardi 14h.",
        ),
        delai(
          "Oui, contrat reçu ! Laisse-moi 48h pour te répondre point par point sur le vocal, je veux te donner un phasage propre. On garde mardi 14h ?",
        ),
        question("Bien reçu 👍 Sur le phasage en trois temps : tu vois plutôt trois livraisons espacées de deux semaines ?"),
      ],
    ],
  },
  {
    conversationId: 'email-vertex-devis',
    series: [
      [
        accepter(
          "Bonjour Julien,\n\nJe vous confirme la bonne réception de votre accord. Je reviens vers vous avec un phasage en trois temps intégrant vos remarques.\n\nBien à vous",
        ),
        question(
          "Bonjour Julien,\n\nAvant de figer le planning, pourriez-vous me confirmer la date à laquelle votre saison se termine ? Cela conditionne le premier jalon.\n\nBien à vous",
        ),
        delai(
          "Bonjour Julien,\n\nJe reviens vers vous en début de semaine prochaine avec la version révisée du devis.\n\nBien à vous",
        ),
      ],
      [
        accepter(
          "Bonjour Julien,\n\nParfait, je prends note de la validation du comité et j'engage la préparation du dossier.\n\nBien à vous",
        ),
        question(
          "Bonjour Julien,\n\nUne précision : souhaitez-vous que le premier jalon soit présenté au comité, ou une validation de votre part suffit-elle ?\n\nBien à vous",
        ),
      ],
    ],
  },
  {
    conversationId: 'li-julien',
    series: [
      [
        accepter("Bonjour Julien, contrat bien reçu, merci. Je vous confirme le rendez-vous de mardi 14h."),
        question("Bonjour Julien, merci pour le contrat. Souhaitez-vous que je vous renvoie un exemplaire contresigné ?"),
      ],
      [
        accepter("Bonjour Julien, tout est bien arrivé. Je reviens vers vous sur WhatsApp pour la suite opérationnelle."),
        question("Bonjour Julien, contrat reçu. La saturation de votre boîte est-elle réglée, ou je continue par ici ?"),
      ],
    ],
  },
  {
    conversationId: 'email-atelier-nord',
    series: [
      [
        accepter(
          "Bonjour Sarah,\n\nJe vous confirme les trois dates du planning. Vous pouvez réserver le studio.\n\nBien à vous",
        ),
        delai(
          "Bonjour Sarah,\n\nJe vous confirme les dates avant jeudi soir, le temps de recouper avec un autre projet. Je suis conscient du délai et je ne vous ferai pas manquer vendredi.\n\nBien à vous",
        ),
        question(
          "Bonjour Sarah,\n\nAvant confirmation : la troisième date reste-t-elle déplaçable d'une journée si nécessaire ?\n\nBien à vous",
        ),
      ],
      [
        accepter(
          "Bonjour Sarah,\n\nC'est validé pour les trois dates. Merci pour votre patience et pour les relances.\n\nBien à vous",
        ),
        delai(
          "Bonjour Sarah,\n\nJe vous réponds demain en fin de matinée, sans faute.\n\nBien à vous",
        ),
        decliner(
          "Bonjour Sarah,\n\nAprès vérification, la semaine du 15 ne tient plus de mon côté. Je préfère vous le dire maintenant : basculons sur octobre.\n\nBien à vous",
        ),
      ],
    ],
  },
  {
    conversationId: 'slack-projet-vertex',
    series: [
      [
        accepter('On part sur la couleur d’accent actuelle, assombrie de deux crans pour passer le AA. Camille, tu peux pousser ça ?'),
        question('Avant de trancher : le contraste tombe à combien exactement sur les boutons secondaires ?'),
      ],
      [
        accepter('C’est tranché : on garde la teinte, on descend la luminosité. Thomas, tu auras la valeur définitive ce soir.'),
        delai('Je regarde ça en fin de journée et je vous donne la couleur définitive avant ce soir.'),
      ],
    ],
  },
  {
    conversationId: 'wa-camille',
    series: [
      [
        accepter('On garde la couleur actuelle, juste assombrie pour le contraste 👍 Tu peux partir là-dessus demain matin'),
        question('Tu proposerais quoi comme alternative ? Si tu as une piste, je suis preneur avant de trancher'),
      ],
      [
        accepter('Garde l’accent actuel, c’est validé côté client. On ne change rien 🙂'),
        delai('Laisse-moi la soirée pour trancher, je te dis ça avant demain 9h'),
      ],
    ],
  },
  {
    conversationId: 'ig-camille',
    series: [
      [
        accepter('Super, je les ajoute au moodboard 🙌'),
        question('Le second, c’est quelle fonderie ? J’aimerais vérifier la licence'),
      ],
      [
        accepter('Nickel, merci ! Ça conforte la piste 3'),
        question('Tu en as d’autres dans le même esprit ?'),
      ],
    ],
  },
  {
    conversationId: 'slack-thomas',
    series: [
      [
        accepter('Testé et validé, cache vidé 👍 Rien à signaler de mon côté'),
        question('Le lien épinglé pointe bien sur la dernière version ?'),
      ],
      [
        accepter('Ça tourne, beau travail. Je fais une relecture détaillée demain'),
        delai('Je teste ce soir et je te fais un retour demain matin'),
      ],
    ],
  },
  {
    conversationId: 'teams-thomas',
    series: [
      [
        accepter('Je t’envoie les contenus de la page équipe aujourd’hui'),
        delai('Désolé pour l’attente, tu les as demain matin au plus tard'),
      ],
      [
        accepter('C’est parti, les textes arrivent dans l’heure'),
        question('Il te faut aussi les photos, ou juste les textes ?'),
      ],
    ],
  },
  {
    conversationId: 'wa-nadia',
    series: [
      [
        accepter('18 parts, c’est confirmé 👍 Et oui, je viens accompagné'),
        question('On est bien sur quinze personnes ? Je peux monter à 20 parts si tu préfères'),
      ],
      [
        accepter('Gâteau pour 18 réservé. Je viens à deux 🎉'),
        delai('Je te confirme tout ça demain, je vérifie de mon côté'),
      ],
    ],
  },
  {
    conversationId: 'ig-nadia',
    series: [
      [
        accepter('Avec plaisir pour la déco, dis-moi ce qu’il faut acheter'),
        question('Tu pars sur quel thème finalement ?'),
      ],
      [
        accepter('Compte sur moi, je passe samedi matin donner un coup de main'),
        question('Il te manque encore quelque chose ?'),
      ],
    ],
  },
  {
    conversationId: 'li-karim',
    series: [
      [
        decliner(
          "Bonjour Karim,\n\nMerci pour votre persévérance. Après réflexion, je préfère ne pas donner suite : mon activité actuelle me convient et je ne souhaite pas mobiliser votre temps inutilement.\n\nBien à vous",
        ),
        accepter(
          "Bonjour Karim,\n\nVolontiers pour vingt minutes, sans engagement de ma part. Jeudi ou vendredi en fin de journée me conviendraient.\n\nBien à vous",
        ),
        delai(
          "Bonjour Karim,\n\nJe suis en pleine livraison client jusqu'à la fin du mois. Puis-je revenir vers vous début du mois prochain ?\n\nBien à vous",
        ),
      ],
      [
        decliner(
          "Bonjour Karim,\n\nJe vous remercie pour l'intérêt porté à mon profil, mais je ne donnerai pas suite. N'hésitez pas à me recontacter dans un an.\n\nBien à vous",
        ),
        accepter(
          "Bonjour Karim,\n\nD'accord pour un échange court. Proposez-moi deux créneaux, je m'adapte.\n\nBien à vous",
        ),
      ],
    ],
  },
  {
    conversationId: 'email-karim',
    series: [
      [
        question(
          "Bonjour Karim,\n\nUne dernière question avant de me décider : le poste implique-t-il du management direct ?\n\nBien à vous",
        ),
        decliner(
          "Bonjour Karim,\n\nAprès lecture de la fiche, le poste ne correspond pas à ce que je recherche aujourd'hui. Merci pour votre temps.\n\nBien à vous",
        ),
      ],
      [
        accepter(
          "Bonjour Karim,\n\nLa fiche est claire et le cadre me convient. Je suis disponible pour un premier échange.\n\nBien à vous",
        ),
        delai(
          "Bonjour Karim,\n\nJe vous donne une réponse avant la clôture des candidatures.\n\nBien à vous",
        ),
      ],
    ],
  },
  {
    conversationId: 'email-elodie',
    series: [
      [
        accepter(
          "Bonjour Élodie,\n\nJe vous envoie le relevé de frais de déplacement dans la journée. Merci pour vos relances et désolé pour ce retard.\n\nBien à vous",
        ),
        delai(
          "Bonjour Élodie,\n\nLe relevé sera reconstitué et envoyé demain matin au plus tard. Nous resterons dans les délais de dépôt.\n\nBien à vous",
        ),
        question(
          "Bonjour Élodie,\n\nUn relevé bancaire annoté peut-il suffire, à défaut du justificatif détaillé ?\n\nBien à vous",
        ),
      ],
      [
        accepter(
          "Bonjour Élodie,\n\nC'est en cours, vous l'aurez avant ce soir.\n\nBien à vous",
        ),
        delai(
          "Bonjour Élodie,\n\nPouvons-nous déposer la déclaration sans cette pièce et la régulariser ensuite ?\n\nBien à vous",
        ),
      ],
    ],
  },
  {
    conversationId: 'teams-elodie',
    series: [
      [
        accepter('Bonjour Élodie, le relevé part aujourd’hui, vous l’aurez avant ce soir'),
        delai('Bonjour Élodie, je le termine demain matin et vous l’envoie dans la foulée'),
        question('Bonjour Élodie, un relevé bancaire annoté peut-il faire l’affaire ?'),
      ],
      [
        accepter('C’est envoyé sur votre boîte, désolé pour l’attente'),
        delai('Encore 24h et vous l’avez, promis cette fois'),
      ],
    ],
  },
]

export function getReplySet(conversationId: string): SuggestedReplySet | undefined {
  return replySets.find((set) => set.conversationId === conversationId)
}
