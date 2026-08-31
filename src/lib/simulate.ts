/* ============================================================================
   SIMULATION DE L'IA

   Aucun modèle n'est appelé : les réponses sont écrites à la main dans
   /src/data/. Ce fichier ne fournit que la temporisation qui rend la
   génération crédible — sans ce délai, ça ne ressemble pas à de l'IA.
============================================================================ */

/** Délai de réflexion d'Eko, entre 600 et 1200 ms */
export function thinkingDelay(): number {
  return 600 + Math.random() * 600
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
