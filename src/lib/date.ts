/* Mise en forme des dates en français, façon messagerie. */

const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })
const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' })
const dayMonthFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })
const fullDateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/** Nombre de jours calendaires entre une date et aujourd'hui */
function daysBetweenToday(date: Date): number {
  return Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
}

/** Heure seule : « 14:32 » */
export function formatTime(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate))
}

/** Horodatage compact affiché dans la liste des conversations */
export function formatListTimestamp(isoDate: string): string {
  const date = new Date(isoDate)
  const days = daysBetweenToday(date)

  if (days === 0) return timeFormatter.format(date)
  if (days === 1) return 'Hier'
  if (days < 7) return weekdayFormatter.format(date)
  if (date.getFullYear() === new Date().getFullYear()) return dayMonthFormatter.format(date)
  return fullDateFormatter.format(date)
}

/** Séparateur de journée affiché au fil de la conversation */
export function formatDaySeparator(isoDate: string): string {
  const date = new Date(isoDate)
  const days = daysBetweenToday(date)

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return capitalize(`${weekdayFormatter.format(date)} ${dayMonthFormatter.format(date)}`)
  if (date.getFullYear() === new Date().getFullYear()) return capitalize(dayMonthFormatter.format(date))
  return capitalize(fullDateFormatter.format(date))
}

/** Deux dates tombent-elles le même jour ? */
export function isSameDay(a: string, b: string): boolean {
  return startOfDay(new Date(a)) === startOfDay(new Date(b))
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
