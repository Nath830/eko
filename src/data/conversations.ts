import type { Attachment, Conversation, Message, VoiceNote } from '../types'
import { daysAgo, hoursAgo, minutesAgo } from '../lib/time'

/* ============================================================================
   CONVERSATIONS

   👉 C'est le fichier à modifier pour changer le contenu de la démo.

   Raccourcis d'écriture :
      them('texte', quand)             → message reçu
      them('texte', quand, 'Camille')  → message reçu dans un canal
      me('texte', quand)               → message envoyé
      withFiles(message, [file(…)])    → ajoute une pièce jointe
      withId(
        voiceFrom(durée, transcription, quand),
        'julien-vocal',
      )  → message vocal reçu
      proposes(message, 'prop-…')      → rendez-vous détecté par Eko

   Horaires :
      minutesAgo(18) · hoursAgo(3) · daysAgo(2, '18:40')
============================================================================ */

let sequence = 0
const nextId = () => `msg-${++sequence}`

const them = (text: string, sentAt: string, authorName?: string): Message => ({
  id: nextId(),
  from: 'them',
  authorName,
  text,
  sentAt,
})

const me = (text: string, sentAt: string): Message => ({
  id: nextId(),
  from: 'me',
  text,
  sentAt,
})

const voiceFrom = (voice: VoiceNote, sentAt: string, authorName?: string): Message => ({
  id: nextId(),
  from: 'them',
  authorName,
  sentAt,
  voice,
})

const file = (fileName: string, kind: Attachment['kind'], sizeLabel: string): Attachment => ({
  id: `file-${fileName}`,
  fileName,
  kind,
  sizeLabel,
})

const withFiles = (message: Message, attachments: Attachment[]): Message => ({ ...message, attachments })

const proposes = (message: Message, eventProposalId: string): Message => ({ ...message, eventProposalId })

/** Identifiant stable, pour les messages cités par les alertes, la recherche
    ou l'interconnexion. Sans lui, l'identifiant dépendrait de l'ordre du fichier. */
const withId = (message: Message, id: string): Message => ({ ...message, id })

export const conversations: Conversation[] = [
  /* ==========================================================================
     FIL ROUGE — Julien Meyer (Studio Vertex)
     Le devis part par e-mail, la relance et le vocal arrivent sur WhatsApp,
     le contrat signé revient par LinkedIn. Trois canaux, un seul dossier.
  ========================================================================== */

  {
    id: 'email-vertex-devis',
    topicId: 'vertex',
    topicRole: "Demande de devis et envoi du devis",
    platform: 'email',
    contactId: 'julien',
    title: 'Julien Meyer',
    subtitle: 'julien.meyer@studiovertex.fr',
    subject: "Refonte de l'identité — demande de devis",
    ekoDigest:
      "A reçu le devis de refonte et doit revenir avec la position de son comité",
    labelIds: ['devis'],
    unreadCount: 0,
    messages: [
      withId(
        them(
          "Bonjour,\n\nNous engageons cette année la refonte complète de l'identité visuelle de Studio Vertex : logo, système typographique, charte et déclinaisons.\n\nPourriez-vous nous adresser un devis détaillé ainsi qu'une estimation de délai ?\n\nBien cordialement,\nJulien Meyer\nStudio Vertex",
          daysAgo(21, '09:42'),
        ),
        'vertex-demande-devis',
      ),
      me(
        "Bonjour Julien,\n\nMerci pour votre message, le projet m'intéresse.\n\nTrois précisions m'aideraient à chiffrer justement :\n— souhaitez-vous conserver une partie de l'existant ?\n— quelle est la date de mise en ligne visée ?\n— avez-vous une enveloppe indicative ?\n\nBien à vous",
        daysAgo(21, '14:05'),
      ),
      them(
        "Bonjour,\n\nRéponses dans l'ordre :\n— nous repartons de zéro, seul le nom est conservé ;\n— mise en ligne souhaitée pour la rentrée de janvier ;\n— l'enveloppe se situe autour de 15 000 € HT.\n\nBien cordialement,\nJulien Meyer",
        daysAgo(20, '08:55'),
      ),
      withId(
        withFiles(
          me(
            "Bonjour Julien,\n\nVous trouverez ci-joint le devis correspondant à ce périmètre, décomposé par lot.\n\nIl reste valable trente jours. Je reste disponible pour en discuter.\n\nBien à vous",
            daysAgo(19, '11:20'),
          ),
          [file('Devis_Vertex_identite_v1.pdf', 'devis', '214 Ko')],
        ),
        'vertex-envoi-devis',
      ),
      them(
        "Bonjour,\n\nBien reçu, merci. Je le soumets au comité de direction mercredi et reviens vers vous dans la foulée.\n\nBien cordialement,\nJulien Meyer",
        daysAgo(18, '17:32'),
      ),
      them(
        "Bonjour,\n\nUne question sur le lot 3 : les déclinaisons réseaux sociaux sont-elles comprises dans le forfait, ou facturées en supplément ?\n\nBien cordialement,\nJulien Meyer",
        daysAgo(16, '10:14'),
      ),
      me(
        "Bonjour Julien,\n\nElles sont comprises : le lot 3 couvre les gabarits pour six formats sociaux, ainsi que le guide d'usage associé.\n\nBien à vous",
        daysAgo(16, '12:02'),
      ),
      them(
        "Parfait, c'est noté.\n\nJe reviens vers vous en fin de semaine avec la position du comité.\n\nBien cordialement,\nJulien Meyer",
        daysAgo(15, '09:03'),
      ),
      me("Très bien, bonne fin de semaine.\n\nBien à vous", daysAgo(15, '09:40')),
    ],
  },

  {
    id: 'wa-julien',
    topicId: 'vertex',
    topicRole: "Négociation, vocal et proposition de rendez-vous",
    platform: 'whatsapp',
    contactId: 'julien',
    title: 'Julien Meyer',
    subtitle: '+33 6 21 44 90 17',
    ekoDigest:
      "Vous relance sur le devis Vertex, a laissé un vocal et propose un point mardi 14h",
    labelIds: ['devis'],
    unreadCount: 3,
    awaitingReplySince: daysAgo(2, '09:15'),
    messages: [
      them("Salut, c'est Julien de Vertex 👋 je passe par ici, c'est plus simple que le mail", daysAgo(14, '18:22')),
      me('Salut Julien, ça marche 👍', daysAgo(14, '18:40')),
      them('Le devis est passé au comité ce matin, on est ok sur le principe', daysAgo(13, '09:11')),
      me('Super nouvelle 🙌 je bloque des dispos de mon côté', daysAgo(13, '09:25')),
      them('Petite relance : tu as vu mes retours sur le périmètre ?', daysAgo(9, '16:48')),
      me('Oui, je te fais un retour détaillé demain', daysAgo(9, '17:30')),
      voiceFrom(
        {
          durationSec: 100,
          transcript:
            "Salut, c'est Julien. Alors, j'ai fait le tour avec l'équipe : on valide le devis, on est à 14 200 euros après arbitrage sur le lot 4. Par contre on aimerait décaler le démarrage au début du mois prochain, le temps de boucler notre saison. Deuxième point : est-ce que tu peux nous refaire un phasage en trois temps, avec un premier jalon uniquement sur la typo et le logo ? Ça rassurerait le comité. Et dernière chose, les déclinaisons réseaux sociaux, on les veut vraiment dans le lot, pas en option. Rappelle-moi ou écris-moi quand tu peux, c'est pas urgent urgent mais j'aimerais qu'on cale ça cette semaine.",
        },
        daysAgo(6, '11:02'),
      ),
      me('Merci pour le vocal, je reprends chaque point et je te réponds demain', daysAgo(6, '14:20')),
      them('Nickel, pas de souci', daysAgo(4, '10:05')),
      withId(
        proposes(
          them('Dis, on avance ? Je suis dispo mardi 14h si tu veux qu’on cale un point', daysAgo(2, '09:15')),
          'prop-julien-mardi',
        ),
        'julien-proposition-rdv',
      ),
      them("J'ai signé le contrat, je te l'envoie ce soir", daysAgo(1, '18:40')),
      them('Tu l’as bien reçu ? 🙂', minutesAgo(12)),
    ],
  },

  {
    id: 'li-julien',
    topicId: 'vertex',
    topicRole: "Contrat signé reçu en pièce jointe",
    platform: 'linkedin',
    contactId: 'julien',
    title: 'Julien Meyer',
    subtitle: 'Fondateur · Studio Vertex',
    ekoDigest:
      "Vous a envoyé le contrat Vertex signé en pièce jointe hier soir",
    labelIds: ['devis'],
    unreadCount: 2,
    messages: [
      them(
        "Bonjour, ravi de vous avoir croisé à la conférence Signes la semaine dernière. Je me permets d'ajouter votre profil.",
        daysAgo(20, '14:30'),
      ),
      me('Bonjour Julien, avec plaisir. Très bon échange sur votre stand.', daysAgo(20, '18:02')),
      them('Votre travail sur les identités de festivals correspond exactement à ce qu’on cherche.', daysAgo(12, '10:15')),
      me('Merci, c’est un terrain que je connais bien. On en reparle dans le cadre du devis.', daysAgo(12, '11:40')),
      them('Je vois qu’on partage une vingtaine de relations, le monde est petit.', daysAgo(5, '16:20')),
      me('Effectivement 🙂', daysAgo(5, '17:05')),
      withId(
        withFiles(
          them('Contrat signé, scanné ce soir. Je vous l’envoie ici, le mail de la boîte est saturé.', daysAgo(1, '19:12')),
          [file('Contrat_Vertex_signe.pdf', 'contrat', '1,2 Mo')],
        ),
        'julien-contrat-signe',
      ),
      them('Bonne soirée, et à mardi j’espère !', daysAgo(1, '19:13')),
    ],
  },
  /* ==========================================================================
     ATELIER NORD — Sarah Nguyen
  ========================================================================== */

  {
    id: 'email-atelier-nord',
    topicId: 'atelier-nord',
    topicRole: "Planning de production de septembre",
    platform: 'email',
    contactId: 'sarah',
    title: 'Sarah Nguyen',
    subtitle: 's.nguyen@ateliernord.com',
    subject: 'Planning de production — septembre',
    ekoDigest:
      "Attend la validation de trois dates avant de bloquer le studio de tournage",
    labelIds: ['support'],
    unreadCount: 0,
    awaitingReplySince: hoursAgo(2),
    messages: [
      them(
        "Bonjour,\n\nJe reviens vers vous pour caler le planning de production de septembre. Deux créneaux nous conviendraient pour la phase de tournage : la semaine du 8 ou celle du 15.\n\nQuelle option a votre préférence ?\n\nBien cordialement,\nSarah Nguyen",
        daysAgo(18, '09:30'),
      ),
      me(
        "Bonjour Sarah,\n\nLa semaine du 15 me semble plus confortable : elle laisse une semaine de marge après la validation des maquettes.\n\nBien à vous",
        daysAgo(18, '15:12'),
      ),
      them(
        "Bonjour,\n\nParfait, je réserve la semaine du 15 auprès de l'équipe technique.\n\nBien cordialement,\nSarah Nguyen",
        daysAgo(17, '08:40'),
      ),
      me("Bonjour Sarah,\n\nTrès bien, merci. Je vous confirme les livrables d'ici la fin de semaine.\n\nBien à vous", daysAgo(16, '10:05')),
      withFiles(
        them(
          "Bonjour,\n\nVous trouverez ci-joint le planning consolidé, jalons et responsables inclus.\n\nMerci de me confirmer les trois dates surlignées.\n\nBien cordialement,\nSarah Nguyen",
          daysAgo(12, '11:22'),
        ),
        [file('Planning_production_septembre.pdf', 'document', '486 Ko')],
      ),
      me("Bonjour Sarah,\n\nBien reçu, je regarde cela en début de semaine prochaine.\n\nBien à vous", daysAgo(11, '09:15')),
      them(
        "Bonjour,\n\nPetit rappel concernant les trois dates : l'équipe technique attend le retour pour bloquer le studio.\n\nBien cordialement,\nSarah Nguyen",
        daysAgo(8, '14:50'),
      ),
      me("Bonjour Sarah,\n\nJe vous reviens très vite, le temps de recouper avec un autre projet.\n\nBien à vous", daysAgo(8, '16:30')),
      them(
        "Bonjour,\n\nAvez-vous pu avancer ? Nous devons confirmer au studio avant vendredi.\n\nBien cordialement,\nSarah Nguyen",
        daysAgo(5, '09:05'),
      ),
      withId(
        them(
          "Bonjour,\n\nJe me permets une dernière relance : sans retour de votre part, nous devrons repositionner le tournage en octobre.\n\nBien cordialement,\nSarah Nguyen",
          hoursAgo(2),
        ),
        'sarah-derniere-relance',
      ),
    ],
  },

  /* ==========================================================================
     ÉQUIPE — canal partagé du projet Vertex
  ========================================================================== */

  {
    id: 'slack-projet-vertex',
    memberCount: 4,
    topicId: 'vertex',
    topicRole: "Exécution côté équipe",
    platform: 'slack',
    title: '#projet-vertex',
    subtitle: 'Canal partagé · 4 membres',
    isGroup: true,
    participantIds: ['camille', 'thomas', 'sarah'],
    ekoDigest:
      "L'équipe attend la couleur définitive pour corriger deux contrastes insuffisants",
    labelIds: ['vertex'],
    unreadCount: 5,
    messages: [
      them('Je crée le canal pour tout centraliser sur Vertex 🙂', daysAgo(16, '09:04'), 'Camille'),
      me('Bonne idée, on arrête de se perdre en DM', daysAgo(16, '09:08')),
      them('Je m’ajoute côté production, je suivrai les jalons ici', daysAgo(16, '09:31'), 'Sarah'),
      them('Présent 👋 je prendrai l’intégration', daysAgo(16, '10:12'), 'Thomas'),
      them('J’ai commencé les explorations typo, trois pistes pour l’instant', daysAgo(14, '11:45'), 'Camille'),
      me('Tu peux poster les trois ici quand elles sont présentables ?', daysAgo(14, '12:02')),
      them('Oui, demain matin', daysAgo(14, '12:03'), 'Camille'),
      them('Piste 1 : grotesque étroite, très lisible en petit corps', daysAgo(13, '09:22'), 'Camille'),
      them('Piste 2 : une antique un peu plus chaude, moins consensuelle', daysAgo(13, '09:23'), 'Camille'),
      them('Piste 3 : mélange des deux, titrage antique et texte grotesque', daysAgo(13, '09:24'), 'Camille'),
      me('La 3 est celle qui raconte le plus. On la garde comme base', daysAgo(13, '10:40')),
      them('D’accord avec toi, la 3 tient mieux en déclinaison', daysAgo(13, '11:05'), 'Sarah'),
      them('Je prépare le jeu de composants côté front en attendant', daysAgo(12, '15:20'), 'Thomas'),
      them('Attention à la casse des titres, on avait dit pas de capitales pleines', daysAgo(11, '09:50'), 'Camille'),
      me('Noté, je corrige la maquette de la home', daysAgo(11, '10:15')),
      them('Le comité Vertex valide le principe du devis, on peut avancer sereinement', daysAgo(10, '17:40'), 'Sarah'),
      them('👍', daysAgo(10, '17:44'), 'Thomas'),
      them('Question bête : on part sur quelle grille ? 12 colonnes comme d’habitude ?', daysAgo(7, '14:02'), 'Thomas'),
      me('Oui, 12 colonnes, gouttière 24', daysAgo(7, '14:20')),
      them('Parfait, je cale ça', daysAgo(7, '14:21'), 'Thomas'),
      them('La préprod est en ligne, lien en épingle du canal', daysAgo(3, '16:35'), 'Thomas'),
      them('Je viens de relire, il reste deux contrastes en dessous du AA sur les boutons secondaires', daysAgo(1, '11:12'), 'Camille'),
      them('Je peux corriger, mais il me faut la couleur définitive', daysAgo(1, '11:30'), 'Thomas'),
      withId(
        proposes(them('On tranche cet après-midi ?', minutesAgo(35), 'Camille'), 'prop-camille-couleur'),
        'camille-proposition-point',
      ),
    ],
  },

  /* ==========================================================================
     CAMILLE ROUSSEAU
  ========================================================================== */

  {
    id: 'wa-camille',
    topicId: 'vertex',
    topicRole: "Organisation et direction artistique",
    platform: 'whatsapp',
    contactId: 'camille',
    title: 'Camille Rousseau',
    subtitle: '+33 6 78 12 05 44',
    ekoDigest:
      "Demande si elle garde la couleur d'accent actuelle avant de travailler demain matin",
    labelIds: ['vertex'],
    unreadCount: 2,
    messages: [
      them('Coucou ! Je confirme mes dispos à partir de la semaine prochaine', daysAgo(13, '08:40')),
      me('Parfait, ça tombe bien, Vertex démarre dans la foulée', daysAgo(13, '09:02')),
      them('Tu me diras le volume, je bloque en conséquence', daysAgo(13, '09:05')),
      me('Je dirais 12 jours sur six semaines', daysAgo(12, '18:22')),
      them('Ça me va 👌', daysAgo(12, '18:40')),
      them('Par contre je serai en déplacement les 3 et 4', daysAgo(11, '10:15')),
      me('Aucun souci, on décale le point hebdo au 5', daysAgo(11, '10:30')),
      them('Top. Tu as vu mes trois pistes typo sur le canal ?', daysAgo(10, '17:05')),
      me('Oui, on part sur la 3', daysAgo(10, '17:20')),
      them('Yes, c’était ma préférée aussi 🙂', daysAgo(10, '17:22')),
      me('Tu peux me sortir une planche de déclinaisons pour vendredi ?', daysAgo(5, '11:40')),
      them('Ça marche', daysAgo(5, '12:01')),
      them('Petite question : on garde la couleur d’accent actuelle ou tu veux que je propose autre chose ?', daysAgo(2, '16:12')),
      withId(
        them('Dis-moi vite, je bosse dessus demain matin', daysAgo(1, '19:05')),
        'camille-question-couleur',
      ),
      them('Sinon on se voit vendredi 10h au studio pour trancher ?', daysAgo(1, '19:08')),
    ],
  },

  {
    id: 'ig-camille',
    topicId: 'vertex',
    topicRole: "Références visuelles pour le moodboard",
    platform: 'instagram',
    contactId: 'camille',
    title: 'Camille Rousseau',
    subtitle: '@camille.rsx',
    ekoDigest:
      "Vous a envoyé deux références typographiques à ajouter au moodboard Vertex",
    labelIds: ['vertex'],
    unreadCount: 0,
    messages: [
      them('Regarde ce compte, la direction typo est exactement dans l’esprit Vertex', daysAgo(10, '21:14')),
      me('Ah oui, très bien vu 👀', daysAgo(10, '21:40')),
      them('Je t’envoie deux autres références demain', daysAgo(10, '21:41')),
      them('a répondu à votre story : trop bien cette expo !', daysAgo(8, '19:22')),
      me('C’était vraiment chouette, je te conseille d’y aller avant la fin du mois', daysAgo(8, '19:50')),
      them('Noté 🙌', daysAgo(8, '19:52')),
      them('Les deux références promises 👇', daysAgo(6, '13:05')),
      them('Le second est plus proche de la piste 3', daysAgo(6, '13:06')),
      me('Parfait, je les ajoute au moodboard', daysAgo(4, '09:30')),
    ],
  },

  /* ==========================================================================
     THOMAS LEFÈVRE
  ========================================================================== */

  {
    id: 'slack-thomas',
    topicId: 'integration',
    topicRole: "Points techniques",
    platform: 'slack',
    contactId: 'thomas',
    title: 'Thomas Lefèvre',
    subtitle: 'Développeur front-end',
    ekoDigest:
      "Signale que la préproduction est en ligne et qu'il faut vider le cache",
    labelIds: ['support'],
    unreadCount: 0,
    messages: [
      them('Salut, tu as deux minutes pour un point technique ?', daysAgo(9, '10:02')),
      me('Vas-y', daysAgo(9, '10:04')),
      them('Les icônes en SVG, tu me les livres en fichiers séparés ou en sprite ?', daysAgo(9, '10:05')),
      me('Fichiers séparés, je te ferai un dossier propre', daysAgo(9, '10:12')),
      them('Nickel, ça m’arrange', daysAgo(9, '10:13')),
      them('Autre chose : la police de titrage, on la charge en woff2 ?', daysAgo(6, '15:40')),
      me('Oui, woff2 uniquement, avec un fallback système', daysAgo(6, '15:52')),
      them('Ok, je gère', daysAgo(6, '15:53')),
      them('La préprod est déployée, tu peux tester quand tu veux', daysAgo(3, '16:30')),
      me('Je regarde ce soir', daysAgo(3, '17:10')),
      them('Pense à vider le cache, sinon tu verras l’ancienne version', hoursAgo(6)),
    ],
  },

  {
    id: 'teams-thomas',
    topicId: 'integration',
    topicRole: "Canal de secours",
    platform: 'teams',
    contactId: 'thomas',
    title: 'Thomas Lefèvre',
    subtitle: 'Studio Nova · Teams',
    ekoDigest:
      "Il lui manque toujours les contenus définitifs de la page équipe",
    labelIds: ['support'],
    unreadCount: 1,
    messages: [
      them('Slack est down chez nous, je bascule sur Teams', daysAgo(7, '08:12')),
      me('Reçu. C’est urgent ?', daysAgo(7, '08:20')),
      them('Le build de prod passe pas, erreur sur les polices', daysAgo(7, '08:22')),
      me('Je t’envoie les bons fichiers dans 10 min', daysAgo(7, '08:25')),
      them('Impec, c’est reparti 👍', daysAgo(7, '09:02')),
      me('Parfait', daysAgo(7, '09:05')),
      them('Slack est revenu, on repasse là-bas', daysAgo(7, '11:30')),
      withId(
        them('Petit rappel : il me manque toujours les contenus définitifs de la page équipe', daysAgo(2, '17:48')),
        'thomas-contenus',
      ),
    ],
  },

  /* ==========================================================================
     NADIA BENALI — personnel
  ========================================================================== */

  {
    id: 'wa-nadia',
    topicId: 'anniversaire',
    topicRole: "Organisation avec Nadia",
    platform: 'whatsapp',
    contactId: 'nadia',
    title: 'Nadia Benali',
    subtitle: '+33 6 09 55 71 23',
    ekoDigest:
      "Attend le nombre de parts pour le gâteau et si vous venez accompagné",
    labelIds: ['perso'],
    unreadCount: 2,
    messages: [
      them('Coucou ! On lance l’organisation pour les 30 ans de Marc 🎉', daysAgo(20, '11:40')),
      me('Évidemment, je suis dedans. Dis-moi ce que je prends', daysAgo(20, '11:52')),
      them('Le gâteau, si tu peux. Et surtout pas un mot 🤫', daysAgo(20, '12:05')),
      me('Motus 🤐', daysAgo(20, '12:06')),
      them('On vise le samedi 12, chez Léa', daysAgo(18, '19:20')),
      me('Ça marche pour moi', daysAgo(18, '19:45')),
      them('On sera une quinzaine je pense', daysAgo(17, '08:30')),
      me('Ok, je pars sur un gâteau pour 18, on n’est jamais trop large', daysAgo(17, '09:12')),
      them('Parfait 😄', daysAgo(17, '09:14')),
      them('Tu connais un bon pâtissier vers Bastille ?', daysAgo(12, '17:02')),
      me('Oui, je t’envoie l’adresse ce soir', daysAgo(12, '17:30')),
      them('Merci !', daysAgo(12, '17:31')),
      me('Voilà : la pâtisserie rue de Charonne, celle avec la devanture verte', daysAgo(11, '21:15')),
      them('Ah oui je vois 👌', daysAgo(11, '21:40')),
      them('Dernière ligne droite : tu peux confirmer le nombre de parts avant vendredi ?', daysAgo(3, '10:22')),
      withId(
        them('Et est-ce que tu viens avec quelqu’un ?', daysAgo(1, '20:05')),
        'nadia-question-accompagne',
      ),
    ],
  },

  {
    id: 'ig-nadia',
    topicId: 'anniversaire',
    topicRole: "Choix du lieu",
    platform: 'instagram',
    contactId: 'nadia',
    title: 'Nadia Benali',
    subtitle: '@nadia.bnl',
    ekoDigest:
      "Échange détendu sur le lieu de l'anniversaire de Marc, rien en attente",
    labelIds: ['perso'],
    unreadCount: 0,
    messages: [
      them('a répondu à votre story : haha excellent 😂', daysAgo(15, '22:10')),
      me('Je savais que ça te plairait', daysAgo(15, '22:30')),
      them('Regarde ce lieu, ça pourrait être bien pour la surprise', daysAgo(14, '18:44')),
      me('Joli, mais un peu petit pour quinze non ?', daysAgo(14, '19:02')),
      them('Ouais tu as raison', daysAgo(14, '19:03')),
      them('On reste chez Léa alors', daysAgo(13, '09:20')),
      me('Ça me semble plus sûr 👍', daysAgo(13, '09:35')),
      them('Je te tiens au courant pour la déco', daysAgo(9, '20:12')),
      me('Nickel, dis-moi si tu veux un coup de main', daysAgo(6, '21:05')),
    ],
  },

  /* ==========================================================================
     KARIM HADDAD — approche de recrutement sur deux canaux
  ========================================================================== */

  {
    id: 'li-karim',
    topicId: 'recrutement',
    topicRole: "Approche initiale sur LinkedIn",
    platform: 'linkedin',
    contactId: 'karim',
    title: 'Karim Haddad',
    subtitle: 'Responsable recrutement · Vaultis',
    ekoDigest:
      "Relance pour un échange de vingt minutes sur le poste de lead design",
    labelIds: ['recrutement'],
    unreadCount: 1,
    awaitingReplySince: hoursAgo(4),
    messages: [
      them(
        'Bonjour, votre parcours en direction artistique a retenu mon attention. Nous ouvrons un poste de lead design chez Vaultis, à Paris.',
        daysAgo(14, '09:40'),
      ),
      me('Bonjour Karim, merci pour votre message. Je ne suis pas en recherche active, mais je reste curieux.', daysAgo(14, '18:12')),
      them('Je comprends. Puis-je vous envoyer la fiche de poste, à toutes fins utiles ?', daysAgo(13, '08:55')),
      me('Volontiers, sur mon adresse professionnelle de préférence.', daysAgo(13, '09:30')),
      them('C’est parti, vous devriez la recevoir dans la journée.', daysAgo(13, '09:35')),
      me('Parfait, merci.', daysAgo(13, '09:40')),
      them('Avez-vous eu l’occasion de la parcourir ?', daysAgo(8, '10:15')),
      withId(
        them('Bonjour, je me permets une relance. Un échange de vingt minutes suffirait à se faire une idée.', hoursAgo(4)),
        'karim-relance',
      ),
    ],
  },

  {
    id: 'email-karim',
    topicId: 'recrutement',
    topicRole: "Fiche de poste et conditions",
    platform: 'email',
    contactId: 'karim',
    title: 'Karim Haddad',
    subtitle: 'k.haddad@vaultis.io',
    subject: 'Poste de lead design — Vaultis',
    ekoDigest:
      "A précisé que le rythme de quatre jours est envisageable après la période d'essai",
    labelIds: ['recrutement'],
    unreadCount: 0,
    messages: [
      withFiles(
        them(
          "Bonjour,\n\nComme convenu sur LinkedIn, vous trouverez ci-joint la fiche du poste de lead design.\n\nL'équipe compte aujourd'hui six personnes et le poste est rattaché à la direction produit.\n\nBien cordialement,\nKarim Haddad",
          daysAgo(13, '14:20'),
        ),
        [file('Fiche_poste_lead_design_Vaultis.pdf', 'document', '328 Ko')],
      ),
      me("Bonjour Karim,\n\nBien reçu, merci. Je prends le temps de la lire cette semaine.\n\nBien à vous", daysAgo(13, '18:05')),
      them(
        "Bonjour,\n\nAvec plaisir. N'hésitez pas si vous souhaitez des précisions sur le périmètre.\n\nBien cordialement,\nKarim Haddad",
        daysAgo(12, '09:10'),
      ),
      me("Bonjour Karim,\n\nUne question : le poste est-il ouvert à un rythme de quatre jours ?\n\nBien à vous", daysAgo(11, '11:32')),
      them(
        "Bonjour,\n\nC'est envisageable après la période d'essai, sous réserve de validation par la direction.\n\nBien cordialement,\nKarim Haddad",
        daysAgo(11, '15:48'),
      ),
      me("Bonjour Karim,\n\nMerci pour cette précision. Je reviens vers vous rapidement.\n\nBien à vous", daysAgo(10, '09:20')),
      them(
        "Bonjour,\n\nJe reste à votre disposition. Nous clôturons les candidatures à la fin du mois.\n\nBien cordialement,\nKarim Haddad",
        daysAgo(9, '08:44'),
      ),
      me("Bonjour Karim,\n\nC'est noté, merci de l'information.\n\nBien à vous", daysAgo(9, '12:15')),
    ],
  },

  /* ==========================================================================
     ÉLODIE MARCHAND — comptabilité, e-mail puis relance sur Teams
  ========================================================================== */

  {
    id: 'email-elodie',
    topicId: 'tva',
    topicRole: "Demande des pièces justificatives",
    platform: 'email',
    contactId: 'elodie',
    title: 'Élodie Marchand',
    subtitle: 'e.marchand@beaumont-associes.fr',
    subject: 'TVA du trimestre — pièces manquantes',
    ekoDigest:
      "Ne pourra pas déposer la TVA sans votre relevé de frais de déplacement",
    labelIds: ['facturation'],
    unreadCount: 0,
    awaitingReplySince: daysAgo(6, '09:05'),
    messages: [
      withId(
        them(
          "Bonjour,\n\nDans le cadre de la déclaration de TVA du trimestre, il me manque deux justificatifs : la facture du prestataire d'impression de juin et le relevé de frais de déplacement.\n\nBien cordialement,\nÉlodie Marchand",
          daysAgo(16, '09:12'),
        ),
        'elodie-demande-pieces',
      ),
      me("Bonjour Élodie,\n\nJe vous envoie les deux documents d'ici la fin de semaine.\n\nBien à vous", daysAgo(16, '14:40')),
      them("Bonjour,\n\nParfait, merci.\n\nBien cordialement,\nÉlodie Marchand", daysAgo(16, '15:02')),
      withFiles(
        me("Bonjour Élodie,\n\nVoici déjà la facture d'impression. Le relevé de frais suivra.\n\nBien à vous", daysAgo(13, '17:25')),
        [file('Facture_impression_juin.pdf', 'facture', '96 Ko')],
      ),
      them(
        "Bonjour,\n\nBien reçue. Il ne manque plus que le relevé de frais de déplacement.\n\nBien cordialement,\nÉlodie Marchand",
        daysAgo(12, '08:50'),
      ),
      them(
        "Bonjour,\n\nJe me permets un rappel concernant le relevé de frais.\n\nBien cordialement,\nÉlodie Marchand",
        daysAgo(9, '10:30'),
      ),
      me("Bonjour Élodie,\n\nJe le reconstitue et vous l'envoie très vite. Désolé pour le délai.\n\nBien à vous", daysAgo(9, '19:12')),
      them(
        "Bonjour,\n\nLa date limite de dépôt approche : sans le relevé, je ne pourrai pas déposer la déclaration dans les temps.\n\nBien cordialement,\nÉlodie Marchand",
        daysAgo(6, '09:05'),
      ),
    ],
  },

  {
    id: 'teams-elodie',
    topicId: 'tva',
    topicRole: "Relance après l'e-mail resté sans réponse",
    platform: 'teams',
    contactId: 'elodie',
    title: 'Élodie Marchand',
    subtitle: 'Cabinet Beaumont · Teams',
    ekoDigest:
      "Demande confirmation : la déclaration de TVA doit partir dans quatre jours",
    labelIds: ['facturation'],
    unreadCount: 1,
    messages: [
      them('Bonjour, Élodie Marchand du cabinet. Je vous ai écrit par mail la semaine dernière', daysAgo(5, '09:20')),
      me('Bonjour Élodie, oui je l’ai vu. Le relevé arrive', daysAgo(5, '12:40')),
      them('Merci. Vous pensez pouvoir l’envoyer avant vendredi ?', daysAgo(5, '13:02')),
      me('Oui, sans faute', daysAgo(5, '13:10')),
      them('Parfait, je vous remercie', daysAgo(5, '13:11')),
      them('Bonjour, toujours rien de mon côté', daysAgo(3, '08:55')),
      me('Je m’en occupe aujourd’hui, promis', daysAgo(3, '09:30')),
      withId(
        them('Bonjour, la déclaration doit partir dans quatre jours. Pouvez-vous me confirmer ?', hoursAgo(8)),
        'elodie-relance-teams',
      ),
    ],
  },

  /* ==========================================================================
     CONVERSATIONS DE GROUPE

     C'est là que le résumé Eko prend tout son sens : beaucoup de voix, du
     contexte à reconstituer, et des décisions qui vous attendent.
  ========================================================================== */

  {
    id: 'wa-vertex-lancement',
    memberCount: 4,
    topicId: 'vertex',
    topicRole: "Coordination du lancement avec le client",
    platform: 'whatsapp',
    title: 'Vertex · lancement 🚀',
    subtitle: 'Julien, Camille, Sarah',
    isGroup: true,
    participantIds: ['julien', 'camille', 'sarah'],
    ekoDigest:
      "Le groupe attend votre arbitrage sur la date de lancement et sur qui rédige les textes du site",
    labelIds: ['vertex'],
    unreadCount: 4,
    awaitingReplySince: hoursAgo(13),
    messages: [
      them('Je crée ce groupe pour qu’on arrête de se croiser en privé 🙂', daysAgo(8, '09:12'), 'Julien'),
      me('Bonne idée, tout le monde voit tout', daysAgo(8, '09:20')),
      them('Présente 👋', daysAgo(8, '09:31'), 'Camille'),
      them('Bonjour à tous, je suis Sarah, je gère la production côté Atelier Nord', daysAgo(8, '10:02'), 'Sarah'),
      them('Objectif : mise en ligne à la rentrée de janvier, on est d’accord ?', daysAgo(7, '11:15'), 'Julien'),
      me('D’accord sur janvier, à condition qu’on valide la charte avant les fêtes', daysAgo(7, '11:40')),
      them('De mon côté la charte est faisable pour mi-décembre', daysAgo(7, '12:05'), 'Camille'),
      them('Attention, la production a besoin de trois semaines après la charte', daysAgo(6, '09:22'), 'Sarah'),
      them('Donc mi-décembre + trois semaines, ça nous met début janvier. Ça passe juste', daysAgo(6, '09:40'), 'Julien'),
      me('Juste mais tenable si personne ne bouge les dates', daysAgo(6, '10:12')),
      them('Autre sujet : qui écrit les textes du site ? On n’a pas tranché', daysAgo(4, '14:30'), 'Camille'),
      them('Chez nous personne n’a le temps, honnêtement', daysAgo(4, '15:02'), 'Julien'),
      them('Atelier Nord peut prendre les textes, mais il faut le budgéter à part', daysAgo(3, '10:45'), 'Sarah'),
      them('On peut aussi partir sur une rédactrice externe, j’en connais une très bien', daysAgo(2, '17:20'), 'Camille'),
      them('Il faut vraiment qu’on tranche cette semaine, sinon ça bloque la maquette', daysAgo(1, '09:05'), 'Camille'),
      them('Je vous laisse décider, je valide le budget derrière 👍', hoursAgo(13), 'Julien'),
    ],
  },



  /* ==========================================================================
     ÉCHANGES INDIVIDUELS COMPLÉMENTAIRES
  ========================================================================== */

  {
    id: 'ig-julien',
    topicId: 'vertex',
    topicRole: "Références et inspirations partagées par le client",
    platform: 'instagram',
    contactId: 'julien',
    title: 'Julien Meyer',
    subtitle: '@julien.vertex',
    ekoDigest: "Vous envoie des références d'identité qu'il aimerait voir dans la direction Vertex",
    labelIds: ['vertex'],
    unreadCount: 2,
    messages: [
      them('Je sais que ce n’est pas le bon canal, mais je viens de tomber là-dessus 👀', daysAgo(9, '22:14')),
      me('Aucun souci, envoie tout ce que tu veux, ça nourrit le moodboard', daysAgo(9, '22:40')),
      them('C’est exactement l’équilibre que je cherche entre sérieux et vivant', daysAgo(9, '22:42')),
      me('Bien noté, je le montre à Camille demain', daysAgo(8, '09:15')),
      them('Parfait 🙌', daysAgo(8, '09:20')),
      them('Autre chose : la typo de ce compte, tu en penses quoi ?', daysAgo(2, '21:30')),
      them('Je trouve qu’elle vieillirait bien, contrairement à la première piste', hoursAgo(7)),
      them('Dis-moi si je me trompe, je ne suis pas du métier 🙂', hoursAgo(6.5)),
    ],
  },

  {
    id: 'wa-thomas',
    topicId: 'integration',
    topicRole: "Coordination rapide en dehors des heures de bureau",
    platform: 'whatsapp',
    contactId: 'thomas',
    title: 'Thomas Lefèvre',
    subtitle: '+33 7 61 33 28 90',
    ekoDigest: 'Propose de décaler la mise en production à lundi pour éviter un déploiement le vendredi',
    labelIds: ['support'],
    unreadCount: 1,
    messages: [
      them('Salut, je te déranges pas ? C’est pour le déploiement', daysAgo(5, '19:40')),
      me('Vas-y', daysAgo(5, '19:52')),
      them('Si on met en prod vendredi et que ça casse, personne n’est là le week-end', daysAgo(5, '19:53')),
      me('Tu proposes quoi ?', daysAgo(5, '20:05')),
      them('Lundi 10h, on a la journée devant nous', daysAgo(5, '20:07')),
      me('Ça me paraît raisonnable, je valide côté client', daysAgo(5, '20:20')),
      them('Nickel 👍', daysAgo(5, '20:21')),
      them('Tu as eu le retour de Julien sur le décalage à lundi ?', daysAgo(1, '18:10')),
      them('Je bloque ma journée de lundi si c’est bon pour toi', hoursAgo(11)),
    ],
  },

  {
    id: 'teams-sarah',
    topicId: 'atelier-nord',
    topicRole: "Canal d'urgence sur le planning de production",
    platform: 'teams',
    contactId: 'sarah',
    title: 'Sarah Nguyen',
    subtitle: 'Atelier Nord · Teams',
    ekoDigest: 'Vous prévient que le studio ne tiendra pas la réservation au-delà de vendredi',
    labelIds: ['support'],
    unreadCount: 1,
    messages: [
      them('Bonjour, Sarah d’Atelier Nord. Je passe par Teams, c’est plus rapide', daysAgo(4, '08:30')),
      me('Bonjour Sarah, je vous écoute', daysAgo(4, '09:02')),
      them('Le studio me demande une confirmation ferme pour les trois dates', daysAgo(4, '09:05')),
      me('Je vous reviens très vite là-dessus', daysAgo(4, '09:30')),
      them('Merci, je tiens le studio informé', daysAgo(4, '09:32')),
      me('Parfait', daysAgo(4, '09:35')),
      them('Ils ne garderont pas le créneau au-delà de vendredi, je préfère vous le dire', daysAgo(2, '16:20')),
      them('Un simple oui ou non me suffit 🙏', hoursAgo(9)),
      them('Je peux vous appeler demain 11h si c’est plus simple', hoursAgo(8.5)),
    ],
  },

]
