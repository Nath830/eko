import type { Label } from '../types'

/* ============================================================================
   ÉTIQUETTES

   Les étiquettes « auto » sont posées par Eko d'après le sujet détecté.
   Les étiquettes « manual » sont créées par l'utilisateur (nom + couleur).
   L'interface distingue visuellement les deux.
============================================================================ */

export const labels: Label[] = [
  { id: 'devis', name: 'Devis', color: '#F0A73B', kind: 'auto' },
  { id: 'recrutement', name: 'Recrutement', color: '#5AAAF5', kind: 'auto' },
  { id: 'support', name: 'Support', color: '#4BD4B0', kind: 'auto' },
  { id: 'facturation', name: 'Facturation', color: '#F2705B', kind: 'auto' },
  { id: 'perso', name: 'Perso', color: '#C98BCB', kind: 'auto' },

  { id: 'vertex', name: 'Studio Vertex', color: '#8B7CF6', kind: 'manual' },
  { id: 'urgent', name: 'À traiter vite', color: '#FF6B6B', kind: 'manual' },
]

export function getLabel(id: string): Label | undefined {
  return labels.find((label) => label.id === id)
}
