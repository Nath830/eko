import type { NaturalQuery } from '../types'

/* ============================================================================
   RECHERCHE EN LANGAGE NATUREL

   La recherche accepte trois entrées : des mots-clés, un nom de contact, et
   du contexte formulé en langage naturel. Ce dernier mode s'appuie sur la
   table ci-dessous : chaque requête reconnue mène directement aux bons
   messages. Si rien ne correspond, on retombe proprement sur la recherche
   par mots-clés.

   Les motifs sont écrits en minuscules et sans accents : la comparaison
   normalise la saisie de l'utilisateur avant de chercher.
============================================================================ */

export const naturalQueries: NaturalQuery[] = [
  {
    patterns: [
      'je cherche une discussion avec un client dont je ne me souviens plus du nom',
      'le client dont j ai oublie le nom',
      'je ne me souviens plus du nom du client',
      'le client pour qui je fais l identite',
      'le client de la refonte',
      'mon client principal',
      'le gars du studio',
      'le type qui veut un nouveau logo',
    ],
    interpretation: 'Le client de la refonte d’identité : Julien Meyer, fondateur de Studio Vertex',
    answer:
      "Vous pensez à Julien Meyer, fondateur de Studio Vertex. C'est votre client sur la refonte d'identité, et vous échangez avec lui sur quatre plateformes : Gmail, WhatsApp, LinkedIn et Instagram.",
    results: [
      { conversationId: 'wa-julien', messageId: 'julien-vocal' },
      { conversationId: 'email-vertex-devis', messageId: 'vertex-demande-devis' },
      { conversationId: 'li-julien', messageId: 'julien-contrat-signe' },
    ],
  },
  {
    patterns: [
      'ma comptable',
      'la personne qui s occupe de la compta',
      'celle qui gere mes impots',
      'le cabinet comptable',
      'la dame de la comptabilite',
    ],
    interpretation: 'Élodie Marchand, votre expert-comptable au cabinet Beaumont',
    answer:
      "C'est Élodie Marchand, expert-comptable au cabinet Beaumont. Elle vous relance sur la TVA du trimestre, par Gmail puis sur Teams.",
    results: [
      { conversationId: 'teams-elodie', messageId: 'elodie-relance-teams' },
      { conversationId: 'email-elodie', messageId: 'elodie-demande-pieces' },
    ],
  },
  {
    patterns: [
      'le recruteur',
      'la personne qui me propose un poste',
      'celui qui me contacte pour un job',
      'l offre d emploi',
      'la boite qui recrute',
    ],
    interpretation: 'Karim Haddad, responsable recrutement chez Vaultis',
    answer:
      "C'est Karim Haddad, responsable recrutement chez Vaultis. Il vous propose un poste de lead design et a relancé ce matin sur LinkedIn.",
    results: [
      { conversationId: 'li-karim', messageId: 'karim-relance' },
      { conversationId: 'email-karim' },
    ],
  },
  {
    patterns: [
      'la personne qui gere la production',
      'la cheffe de projet',
      'celle qui attend mes dates',
      'le planning de tournage',
      'atelier nord',
    ],
    interpretation: 'Sarah Nguyen, cheffe de projet chez Atelier Nord',
    answer:
      "C'est Sarah Nguyen, cheffe de projet chez Atelier Nord. Elle attend la confirmation de trois dates de tournage, relancée ce matin par mail et sur Teams.",
    results: [
      { conversationId: 'email-atelier-nord', messageId: 'sarah-derniere-relance' },
      { conversationId: 'teams-sarah' },
    ],
  },
  {
    patterns: [
      'qui m a envoye un fichier',
      'les documents recus',
      'les pieces jointes',
      'ou sont mes documents',
    ],
    interpretation: 'Les documents reçus ces trois dernières semaines',
    answer:
      "Vous avez reçu quatre documents : le contrat Vertex signé par LinkedIn, le planning d'Atelier Nord et la fiche de poste Vaultis par Gmail. Le devis Vertex, lui, est parti de votre côté.",
    results: [
      { conversationId: 'li-julien', messageId: 'julien-contrat-signe' },
      { conversationId: 'email-vertex-devis', messageId: 'vertex-envoi-devis' },
    ],
  },
  {
    patterns: ['budget du projet vertex', 'budget vertex', 'on parlait du budget', 'montant du projet vertex', 'combien pour vertex'],
    interpretation: 'Les échanges où le budget du projet Vertex est chiffré',
    answer:
      "Le budget de Vertex a été arbitré dans le vocal de Julien Meyer sur WhatsApp : 14 200 € après discussion du lot 4. Le devis d'origine est parti par Gmail.",
    results: [
      { conversationId: 'wa-julien', messageId: 'julien-vocal' },
      { conversationId: 'email-vertex-devis', messageId: 'vertex-envoi-devis' },
    ],
  },
  {
    patterns: ['ou en est le devis', 'ou en est le devis vertex', 'etat du devis', 'le devis de julien'],
    interpretation: 'Le parcours du devis Studio Vertex, de la demande au contrat signé',
    answer:
      "Le devis Vertex est parti par Gmail il y a 19 jours, Julien l'a fait valider par son comité, et le contrat signé est revenu par LinkedIn hier soir.",
    results: [
      { conversationId: 'email-vertex-devis', messageId: 'vertex-demande-devis' },
      { conversationId: 'email-vertex-devis', messageId: 'vertex-envoi-devis' },
      { conversationId: 'li-julien', messageId: 'julien-contrat-signe' },
    ],
  },
  {
    patterns: ['le contrat signe', 'ou est le contrat', 'contrat vertex', 'qui m a envoye le contrat'],
    interpretation: 'Le contrat signé de Studio Vertex, arrivé par LinkedIn',
    answer:
      "Le contrat signé de Studio Vertex est arrivé par LinkedIn hier soir à 19h12 — la boîte mail de Vertex était saturée.",
    results: [{ conversationId: 'li-julien', messageId: 'julien-contrat-signe' }],
  },
  {
    patterns: ['qui attend une reponse', 'qui attend une reponse de moi', 'ce que je dois repondre', 'mes retards'],
    interpretation: 'Les conversations qui attendent une réponse de votre part',
    answer:
      "Quatre personnes attendent une réponse de votre part. Sarah Nguyen et Élodie Marchand sont les plus pressantes.",
    results: [
      { conversationId: 'email-atelier-nord', messageId: 'sarah-derniere-relance' },
      { conversationId: 'teams-elodie', messageId: 'elodie-relance-teams' },
      { conversationId: 'wa-camille', messageId: 'camille-question-couleur' },
      { conversationId: 'li-karim', messageId: 'karim-relance' },
    ],
  },
  {
    patterns: ['la tva', 'les pieces pour la tva', 'ma comptable', 'le releve de frais', 'elodie tva'],
    interpretation: 'La déclaration de TVA et la pièce qui manque encore',
    answer:
      "Il manque le relevé de frais de déplacement à Élodie Marchand. Elle a écrit par Gmail il y a 16 jours, puis a relancé sur Teams ce matin.",
    results: [
      { conversationId: 'email-elodie', messageId: 'elodie-demande-pieces' },
      { conversationId: 'teams-elodie', messageId: 'elodie-relance-teams' },
    ],
  },
  {
    patterns: ['le vocal de julien', 'le message vocal', 'ce que julien a dit au telephone'],
    interpretation: 'Le message vocal de Julien Meyer et sa transcription',
    answer:
      "Julien Meyer a laissé un vocal de 1 min 40 sur WhatsApp il y a 6 jours. Sa transcription est disponible dans la conversation.",
    results: [{ conversationId: 'wa-julien', messageId: 'julien-vocal' }],
  },
  {
    patterns: ['anniversaire de marc', 'le gateau', 'la surprise pour marc', 'anniversaire'],
    interpretation: 'L’organisation de l’anniversaire surprise de Marc',
    answer:
      "L'anniversaire surprise de Marc est prévu samedi 12 chez Léa. Nadia attend votre confirmation sur le gâteau.",
    results: [{ conversationId: 'wa-nadia', messageId: 'nadia-question-accompagne' }],
  },
  {
    patterns: ['les contenus de la page equipe', 'ce que thomas attend', 'page equipe'],
    interpretation: 'Ce que Thomas attend encore pour finir l’intégration',
    answer:
      "Thomas Lefèvre attend les contenus définitifs de la page équipe. Il vous l'a rappelé sur Teams il y a 2 jours.",
    results: [{ conversationId: 'teams-thomas', messageId: 'thomas-contenus' }],
  },
]
