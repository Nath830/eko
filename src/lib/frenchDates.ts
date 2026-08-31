import { normalize } from './search'

/* ============================================================================
   LIRE UNE DATE ÉCRITE EN FRANÇAIS

   « jeudi 14h », « demain midi », « le 12 à 9h30 », « mardi après-midi ».
   Utilisé aussi bien par les ordres donnés à Eko que par la détection des
   rendez-vous dans les messages.
============================================================================ */

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

export const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
export const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

/** Le texte, sans accents, sans tirets ni apostrophes, en minuscules. */
export function flatten(input: string): string {
  return normalize(input)
    .replace(/[-'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Y a-t-il un repère de jour dans la phrase ? */
export function hasDayHint(text: string): boolean {
  return (
    /\b(demain|apres demain|aujourd hui|ce soir|cet apres midi|ce matin)\b/.test(text) ||
    WEEKDAYS.some((day) => new RegExp(`\\b${day}\\b`).test(text)) ||
    /\ble (\d{1,2})\b/.test(text)
  )
}

/** Une heure précise : « 14h », « 14h30 », « 9:00 », « 15 heures ». */
export function hasClockTime(text: string): boolean {
  return /\b\d{1,2}\s*h(\s*\d{2})?\b/.test(text) || /\b\d{1,2}:\d{2}\b/.test(text) || /\b\d{1,2}\s*heures?\b/.test(text)
}

/** Y a-t-il une heure dans la phrase ? */
export function hasTimeHint(text: string): boolean {
  return /\b\d{1,2}\s*h\b/.test(text) || /\b\d{1,2}\s*h\s*\d{2}\b/.test(text) || /\b\d{1,2}:\d{2}\b/.test(text) || /\b\d{1,2}\s*heures?\b/.test(text) || /\b(midi|matin|apres midi|soir)\b/.test(text)
}

/** La date évoquée. Par défaut : demain. */
export function readDate(text: string): Date {
  const date = new Date()

  if (text.includes('apres demain')) {
    date.setDate(date.getDate() + 2)
    return date
  }
  if (text.includes('demain')) {
    date.setDate(date.getDate() + 1)
    return date
  }
  if (/\b(aujourd hui|ce soir|cet apres midi|ce matin)\b/.test(text)) return date

  const weekday = WEEKDAYS.findIndex((day) => new RegExp(`\\b${day}\\b`).test(text))
  if (weekday !== -1) {
    const ahead = (weekday - date.getDay() + 7) % 7
    date.setDate(date.getDate() + (ahead === 0 ? 7 : ahead))
    return date
  }

  // « le 12 » : le prochain 12 du mois
  const dayOfMonth = text.match(/\ble (\d{1,2})\b/)
  if (dayOfMonth) {
    const day = Number(dayOfMonth[1])
    const candidate = new Date(date.getFullYear(), date.getMonth(), day)
    if (candidate < date) candidate.setMonth(candidate.getMonth() + 1)
    return candidate
  }

  date.setDate(date.getDate() + 1)
  return date
}

/** L'heure évoquée. Par défaut : 9h00. */
export function readTime(text: string): { hours: number; minutes: number } {
  const withH = text.match(/\b(\d{1,2})\s*h\s*(\d{2})?/)
  if (withH) return { hours: Number(withH[1]), minutes: Number(withH[2] ?? 0) }

  const withColon = text.match(/\b(\d{1,2}):(\d{2})\b/)
  if (withColon) return { hours: Number(withColon[1]), minutes: Number(withColon[2]) }

  const spelled = text.match(/\b(\d{1,2})\s*heures?\b/)
  if (spelled) return { hours: Number(spelled[1]), minutes: 0 }

  if (text.includes('midi') && !text.includes('apres midi')) return { hours: 12, minutes: 30 }
  if (text.includes('apres midi')) return { hours: 14, minutes: 0 }
  if (text.includes('matin')) return { hours: 9, minutes: 30 }
  if (text.includes('soir')) return { hours: 18, minutes: 30 }

  return { hours: 9, minutes: 0 }
}

/** Le créneau complet, d'une heure par défaut. */
export function readSlot(text: string, durationMinutes = 60): { start: Date; end: Date } {
  const start = readDate(text)
  const { hours, minutes } = readTime(text)
  start.setHours(hours, minutes, 0, 0)

  const end = new Date(start)
  end.setMinutes(end.getMinutes() + durationMinutes)

  return { start, end }
}
