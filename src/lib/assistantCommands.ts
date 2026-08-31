import { PLATFORM_IDS, getPlatform, type PlatformId } from '../config/platforms'
import type { AlertScope, Contact } from '../types'
import { DATE_FORMAT, TIME_FORMAT, flatten, readSlot } from './frenchDates'

/* ============================================================================
   LES ORDRES DONNÉS À EKO

   La barre d'Eko ne sert pas qu'à chercher : on peut lui demander d'agir.

     « mets un rdv avec Julien jeudi 14h »
     « préviens-moi si un client parle de résiliation »

   Ce fichier reconnaît l'intention et en extrait ce qu'il faut : la date,
   l'heure, la personne, la plateforme. Rien n'est envoyé nulle part — c'est
   l'application qui exécute ensuite, après confirmation.
============================================================================ */

import type { BriefKind } from '../data/briefs'
import { DOSSIER_QUESTION_CUES, dossiers, findDossier } from '../data/dossiers'

export type AssistantCommand =
  | {
      kind: 'brief'
      brief: BriefKind
    }
  | {
      /** Montrer ce qu'Eko surveille et ce qui s'est déclenché */
      kind: 'alerts'
    }
  | {
      /** Les non-lus et les messages restés sans réponse */
      kind: 'missed'
    }
  | {
      /** Le point complet sur un sujet, tous canaux confondus */
      kind: 'dossier'
      dossierId: string
    }
  | {
      /** Rédiger un message et transmettre un document à quelqu'un */
      kind: 'send'
      contactId: string
      /** Le document à joindre, deviné d'après la demande */
      documentHint?: string
      /** Faut-il accompagner l'envoi d'un résumé ? */
      withSummary: boolean
    }
  | {
      kind: 'event'
      title: string
      start: string
      end: string
      contactId?: string
      /** Ce qu'Eko répond avant d'agir */
      summary: string
    }
  | {
      kind: 'alert'
      query: string
      contactId?: string
      scope: AlertScope
      summary: string
    }

const ALERT_TRIGGERS = [
  'previens moi',
  'previens',
  'alerte moi',
  'alerte',
  'signale moi',
  'signale',
  'notifie moi',
  'notifie',
  'avertis moi',
]

const ALERT_NOUNS = ['alerte', 'alertes']

const EVENT_VERBS = [
  'met',
  'mets',
  'mettre',
  'ajoute',
  'ajouter',
  'cree',
  'creer',
  'planifie',
  'programme',
  'bloque',
  'cale',
  'fixe',
  'organise',
  'note',
]

const EVENT_NOUNS: { word: string; label: string }[] = [
  { word: 'rendez vous', label: 'Rendez-vous' },
  { word: 'rdv', label: 'Rendez-vous' },
  { word: 'reunion', label: 'Réunion' },
  { word: 'point', label: 'Point' },
  { word: 'appel', label: 'Appel' },
  { word: 'dejeuner', label: 'Déjeuner' },
  { word: 'call', label: 'Appel' },
  { word: 'entretien', label: 'Entretien' },
]

/** La personne nommée dans la phrase, si elle fait partie de vos contacts. */
function readContact(text: string, contacts: Contact[]): Contact | undefined {
  return contacts.find((contact) =>
    flatten(contact.fullName)
      .split(' ')
      .some((part) => part.length > 2 && text.includes(part)),
  )
}

/** La plateforme nommée dans la phrase. */
function readPlatform(text: string): PlatformId | undefined {
  return PLATFORM_IDS.find((id) => text.includes(flatten(getPlatform(id).name)))
}

/* ------------------------------ Récapitulatif --------------------------- */

const BRIEF_PRIORITY = [
  'priorite',
  'priorites',
  'reste de ma journee',
  'reste de la journee',
  'que dois je faire',
  'qu est ce que je dois faire',
  'quoi faire',
  'urgent',
]

const BRIEF_RECENT = [
  'derniers messages',
  'dernier message',
  'quoi de neuf',
  'nouveau depuis',
  'recap des messages',
  'resume des messages',
]

/* Ce qu'on a raté : non-lus, messages sans réponse, oublis. */
const MISSED = [
  'pas lu',
  'pas lus',
  'non lu',
  'non lus',
  'pas repondu',
  'pas encore repondu',
  'sans reponse',
  'reste sans reponse',
  'ce que j ai rate',
  'j ai rate',
  'ai je rate',
  'oublie',
  'oublies',
  'plus importants',
  'les plus importantes',
  'messages importants',
  'en retard',
  'je suis passe a cote',
]

const BRIEF_GENERAL = ['recap', 'recapitulatif', 'brief', 'debrief', 'fais le point', 'point du jour', 'ou j en suis']

/* --------------------------- Consulter les alertes ---------------------- */

const ALERT_LISTING = [
  'mes alertes',
  'les alertes',
  'alertes actives',
  'quelles alertes',
  'liste des alertes',
  'ce que tu surveilles',
  'tu surveilles quoi',
  'qu est ce que tu surveilles',
  'declenchement',
  'declenchements',
  'qu est ce qui s est declenche',
  'ce qui s est declenche',
]

function detectBrief(text: string): BriefKind | null {
  if (BRIEF_PRIORITY.some((cue) => text.includes(cue))) return 'priorities'
  if (BRIEF_RECENT.some((cue) => text.includes(cue))) return 'recent'
  if (BRIEF_GENERAL.some((cue) => text.includes(cue))) return 'day'
  return null
}

export function detectCommand(
  input: string,
  contacts: Contact[],
  /** Le sujet de la conversation d'où l'on parle, s'il y en a une */
  contextTopicId?: string,
): AssistantCommand | null {
  const text = flatten(input)
  if (text.length < 6) return null

  /* ---------------- Le point sur la conversation ouverte ------------------ */
  // Depuis une conversation, « résume » ou « où on en est » suffit : Eko sait
  // déjà de quel dossier il s'agit.
  if (contextTopicId && DOSSIER_QUESTION_CUES.some((cue) => text.includes(cue)) && !findDossier(text)) {
    const known = dossiers.find((dossier) => dossier.topicId === contextTopicId)
    if (known) return { kind: 'dossier', dossierId: known.id }
  }

  /* --------------------- Transmettre un document ------------------------- */
  const sending = ['envoie', 'envoyer', 'envoi', 'transfere', 'transferer', 'transmets', 'transmettre', 'fais suivre', 'partage'].some(
    (verb) => text.includes(verb),
  )

  if (sending) {
    const recipient = readContact(text, contacts)
    if (recipient) {
      const document = ['devis', 'contrat', 'facture', 'planning', 'fiche de poste', 'fiche'].find((word) =>
        text.includes(word),
      )

      return {
        kind: 'send',
        contactId: recipient.id,
        documentHint: document,
        withSummary: text.includes('resume') || text.includes('synthese') || text.includes('point'),
      }
    }
  }

  /* ------------------------ Le point sur un sujet ------------------------ */
  // « où en est le projet Vertex ? » appelle un dossier complet, pas une
  // liste de résultats.
  const dossier = findDossier(text)
  if (dossier) return { kind: 'dossier', dossierId: dossier.id }

  /* --------------------------- Ce qu'on a raté --------------------------- */
  // À vérifier avant les récaps : « ce que j'ai raté » n'est pas un récap.
  if (MISSED.some((cue) => text.includes(cue))) return { kind: 'missed' }

  /* ---------------------------- Récapitulatif ---------------------------- */
  const brief = detectBrief(text)
  if (brief) return { kind: 'brief', brief }

  /* ------------------------- Consulter les alertes ----------------------- */
  // À vérifier avant la création : « mes alertes » n'est pas un ordre.
  if (ALERT_LISTING.some((cue) => text.includes(cue))) return { kind: 'alerts' }

  /* ------------------------------- Alerte -------------------------------- */
  // Le déclencheur doit être suivi de la consigne : « alerte » seul est une
  // recherche, « alerte-moi si un client… » est un ordre.
  const asksAlert =
    ALERT_TRIGGERS.some((trigger) => text.startsWith(trigger) && text.length > trigger.length + 5) ||
    (ALERT_NOUNS.some((noun) => text.includes(noun)) && EVENT_VERBS.some((verb) => text.startsWith(verb)))

  if (asksAlert) {
    const contact = readContact(text, contacts)
    const platform = readPlatform(text)
    const scope: AlertScope = platform ?? 'all'

    // On garde la formulation de l'utilisateur : c'est elle qui sera affichée.
    const query = input.trim().replace(/^\s*(cr[ée]e|ajoute|mets?)\s+(une\s+)?alerte\s*:?\s*/i, '')

    return {
      kind: 'alert',
      query: query.charAt(0).toUpperCase() + query.slice(1),
      contactId: contact?.id,
      scope,
      summary: `Je surveille ${
        contact ? `les messages de ${contact.fullName}` : 'toutes vos conversations'
      } ${platform ? `sur ${getPlatform(platform).name}` : 'sur les six plateformes'} et je vous préviens dès que ça correspond.`,
    }
  }

  /* ----------------------------- Rendez-vous ----------------------------- */
  const noun = EVENT_NOUNS.find((entry) => text.includes(entry.word))
  const hasVerb = EVENT_VERBS.some((verb) => new RegExp(`\\b${verb}\\b`).test(text))
  if (!noun || !hasVerb) return null

  const { start: date, end } = readSlot(text)
  const contact = readContact(text, contacts)
  const title = contact ? `${noun.label} avec ${contact.fullName}` : noun.label

  return {
    kind: 'event',
    title,
    start: date.toISOString(),
    end: end.toISOString(),
    contactId: contact?.id,
    summary: `${DATE_FORMAT.format(date)} à ${TIME_FORMAT.format(date)}, pendant une heure.`,
  }
}

