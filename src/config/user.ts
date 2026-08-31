/* ============================================================================
   L'UTILISATEUR DE LA DÉMONSTRATION

   👉 Changer le prénom affiché sur la page d'accueil se fait ici.
============================================================================ */

import { USER_PHOTO } from '../data/userPhoto'

export const USER = {
  firstName: 'Nath',
  /** La photo affichée dans le rail, en bas */
  photoUrl: USER_PHOTO,
}

/** « Bonjour » le jour, « Bonsoir » à partir de 18 h. */
export function greeting(): string {
  return new Date().getHours() >= 18 ? 'Bonsoir' : 'Bonjour'
}
