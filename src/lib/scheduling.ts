import type { CalendarEvent } from '../types'
import { flatten } from './frenchDates'

/* ============================================================================
   CONFLITS ET CRÉNEAUX DE REMPLACEMENT

   Quand vous proposez une heure déjà prise, Eko dit ce qui est prévu et
   propose trois autres créneaux libres. Cliquer sur l'un d'eux réécrit
   directement votre message.
============================================================================ */

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const DAY_START = 9
const DAY_END = 19

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** L'événement de l'agenda qui occupe déjà ce créneau, s'il y en a un. */
export function findConflict(events: CalendarEvent[], start: Date, end: Date): CalendarEvent | null {
  return (
    events.find((event) => overlaps(start, end, new Date(event.start), new Date(event.end))) ?? null
  )
}

function isFree(events: CalendarEvent[], start: Date, durationMs: number): boolean {
  const end = new Date(start.getTime() + durationMs)
  if (start.getHours() < DAY_START || end.getHours() > DAY_END) return false
  if (start.getDay() === 0 || start.getDay() === 6) return false
  return findConflict(events, start, end) === null
}

export interface Alternative {
  start: Date
  end: Date
  /** Comment l'annoncer : « plus tard le même jour », « jeudi » */
  label: string
}

/** Trois créneaux libres proches de celui demandé. */
export function suggestAlternatives(
  events: CalendarEvent[],
  start: Date,
  durationMs = 3_600_000,
  count = 3,
): Alternative[] {
  const found: Alternative[] = []

  // D'abord le même jour, plus tard, puis les jours suivants à la même heure.
  const candidates: Date[] = []

  for (let hour = start.getHours() + 1; hour <= DAY_END - 1; hour++) {
    const slot = new Date(start)
    slot.setHours(hour, 0, 0, 0)
    candidates.push(slot)
  }

  for (let hour = DAY_START; hour < start.getHours(); hour++) {
    const slot = new Date(start)
    slot.setHours(hour, 0, 0, 0)
    candidates.push(slot)
  }

  for (let day = 1; day <= 7; day++) {
    for (const hour of [start.getHours(), 10, 14, 16]) {
      const slot = new Date(start)
      slot.setDate(slot.getDate() + day)
      slot.setHours(hour, 0, 0, 0)
      candidates.push(slot)
    }
  }

  for (const candidate of candidates) {
    if (found.length >= count) break
    if (candidate.getTime() < Date.now()) continue
    if (!isFree(events, candidate, durationMs)) continue
    if (found.some((item) => item.start.getTime() === candidate.getTime())) continue

    const sameDay = candidate.toDateString() === start.toDateString()
    found.push({
      start: candidate,
      end: new Date(candidate.getTime() + durationMs),
      label: sameDay ? 'même jour' : WEEKDAYS[candidate.getDay()],
    })
  }

  return found
}

/* --------------------- Les questions de disponibilité -------------------- */

const AVAILABILITY_CUES = [
  'libre',
  'dispo',
  'disponible',
  'disponibilites',
  'tu peux',
  'vous pouvez',
  'ca te va',
  'ca vous va',
  'quand est ce que',
]

/** « est-ce que tu es libre mercredi ? » — une question, pas une proposition. */
export function isAvailabilityQuestion(text: string): boolean {
  return AVAILABILITY_CUES.some((cue) => text.includes(cue))
}

/** Les créneaux libres d'une journée, dans les heures ouvrables. */
export function freeSlotsOfDay(
  events: CalendarEvent[],
  day: Date,
  durationMs = 3_600_000,
  count = 4,
): Alternative[] {
  const found: Alternative[] = []

  for (let hour = DAY_START; hour <= DAY_END - 1; hour++) {
    if (found.length >= count) break

    const start = new Date(day)
    start.setHours(hour, 0, 0, 0)
    if (start.getTime() < Date.now()) continue
    if (!isFree(events, start, durationMs)) continue

    found.push({
      start,
      end: new Date(start.getTime() + durationMs),
      label: 'libre',
    })
  }

  return found
}

/* Insère une heure dans le message en cours, avant le point d'interrogation
   s'il y en a un — « tu es libre mercredi ? » devient « tu es libre mercredi
   9h 10h ? ». */
export function appendTimeToText(text: string, time: string): string {
  const trimmed = text.trimEnd()
  if (trimmed.endsWith('?')) return `${trimmed.slice(0, -1).trimEnd()} ${time} ?`
  return `${trimmed} ${time}`
}

/** « 16h » ou « 16h30 » */
export function spokenTime(date: Date): string {
  const minutes = date.getMinutes()
  return minutes === 0 ? `${date.getHours()}h` : `${date.getHours()}h${String(minutes).padStart(2, '0')}`
}

/** Comment nommer ce jour dans une phrase : « demain », « jeudi ». */
export function spokenDay(date: Date): string {
  const today = new Date()
  const days = Math.round(
    (new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      86_400_000,
  )

  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'demain'
  if (days === 2) return 'après-demain'
  return WEEKDAYS[date.getDay()]
}

/* Réécrit la date et l'heure dans le message en cours, sans toucher au reste.
   « on se voit jeudi 14h ? » devient « on se voit vendredi 16h ? ». */
export function rewriteSlotInText(text: string, slot: Date): string {
  let result = text
  const flat = flatten(text)

  // L'heure
  const timePattern = /\b\d{1,2}\s*h\s*\d{2}\b|\b\d{1,2}\s*h\b|\b\d{1,2}:\d{2}\b|\b\d{1,2}\s*heures?\b/i
  if (timePattern.test(result)) {
    result = result.replace(timePattern, spokenTime(slot))
  }

  // Le jour
  const dayWord = WEEKDAYS.find((day) => new RegExp(`\\b${day}\\b`).test(flat))
  const relative = ['après-demain', 'apres-demain', 'demain', "aujourd'hui", 'aujourd hui'].find((word) =>
    new RegExp(`\\b${flatten(word)}\\b`).test(flat),
  )

  if (dayWord) {
    result = result.replace(new RegExp(`\\b${dayWord}\\b`, 'i'), spokenDay(slot))
  } else if (relative) {
    result = result.replace(new RegExp(`\\b${relative}\\b`, 'i'), spokenDay(slot))
  } else {
    result = `${result.trim()} ${spokenDay(slot)}`
  }

  return result
}
