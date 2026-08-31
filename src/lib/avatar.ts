/* Avatars générés à partir du nom : initiales sur un fond coloré stable.
   Aucune image à charger, donc un rendu net partout et hors connexion. */

const PALETTE = [
  '#7B68D9', '#2E9179', '#C1763F', '#4A87CE',
  '#C25C4C', '#5A9668', '#9C63A8', '#3D77BE',
]

/** Toujours la même couleur pour un même nom */
export function avatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100_000
  }
  return PALETTE[hash % PALETTE.length]
}

/** « Sarah Nguyen » → SN · « #design-produit » → # · « Maman » → MA */
export function initials(title: string): string {
  if (title.startsWith('#')) return '#'

  const words = title
    .replace(/[^\p{L}\p{N}\s.]/gu, ' ')
    .split(/[\s.]+/)
    .filter(Boolean)

  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
