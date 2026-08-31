/* ============================================================================
   L'UTILISATEUR DE LA DÉMONSTRATION

   👉 Changer le prénom affiché sur la page d'accueil se fait ici.
============================================================================ */

export const USER = {
  firstName: 'Nath',
  /** Portrait dans la planche src/data/portraits.ts */
  photo: 5,
}

/** « Bonjour » le jour, « Bonsoir » à partir de 18 h. */
export function greeting(): string {
  return new Date().getHours() >= 18 ? 'Bonsoir' : 'Bonjour'
}
