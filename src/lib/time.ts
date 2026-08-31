/* Petits utilitaires pour écrire des horodatages lisibles dans les données
   fictives. Ils sont calculés par rapport à l'instant présent : le prototype
   a donc toujours l'air « frais », même dans six mois. */

function iso(date: Date): string {
  return date.toISOString()
}

export function minutesAgo(minutes: number): string {
  return iso(new Date(Date.now() - minutes * 60_000))
}

export function hoursAgo(hours: number): string {
  return iso(new Date(Date.now() - hours * 3_600_000))
}

/** Il y a N jours, à l'heure indiquée. Ex. daysAgo(2, '18:40') */
export function daysAgo(days: number, time = '10:00'): string {
  const [h, m] = time.split(':').map(Number)
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(h, m, 0, 0)
  return iso(date)
}
